// 自動渲染：啟動 Motion Canvas 開發伺服器 → 用 Chrome(headless) 觸發 Render → 輸出 output/*.mp4
import puppeteer from 'puppeteer-core';
import {spawn, execSync} from 'child_process';
import {existsSync, mkdirSync, readdirSync, statSync, rmSync} from 'fs';
import {setTimeout as sleep} from 'timers/promises';

const BROWSER_CANDIDATES = [
  process.env.CHROME,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const OUT = 'output';
const RENDER_TIMEOUT_MS = 30 * 60 * 1000;

function findBrowser() {
  const browser = BROWSER_CANDIDATES.find(path => existsSync(path));
  if (!browser) {
    throw new Error(
      'Chrome/Edge was not found. Install Google Chrome, Microsoft Edge, or set CHROME to the browser exe path.',
    );
  }
  return browser;
}

function killTree(pid) {
  try {
    execSync(`taskkill /PID ${pid} /T /F`, {stdio: 'ignore'});
  } catch {}
}

function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'serve'], {shell: true});
    let settled = false;
    const onData = d => {
      const raw = d.toString();
      process.stdout.write(raw);
      const s = raw.replace(/\x1b\[[0-9;]*m/g, ''); // 去 ANSI
      const m = s.match(/https?:\/\/localhost:(\d+)\//);
      if (m && !settled) {
        settled = true;
        resolve({proc, url: m[0]});
      }
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('exit', c => {
      if (!settled) reject(new Error('dev server exited early, code ' + c));
    });
    setTimeout(() => !settled && reject(new Error('timed out waiting for dev server')), 60000);
  });
}

function latestMp4() {
  if (!existsSync(OUT)) return null;
  const files = readdirSync(OUT).filter(f => f.endsWith('.mp4')).map(f => `${OUT}/${f}`);
  if (!files.length) return null;
  return files.map(f => ({f, ...statSync(f)})).sort((a, b) => b.mtimeMs - a.mtimeMs)[0];
}

// 判斷某 button 是否為 Render 鈕（label 可能來自 aria-label / title / 內文）
const RENDER_PREDICATE = () =>
  [...document.querySelectorAll('button')].some(b => {
    const t = (b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent || '').trim();
    return t.toLowerCase() === 'render';
  });

const {proc, url} = await startServer();
console.log('\n[render] dev server at', url);
if (existsSync(OUT)) rmSync(OUT, {recursive: true, force: true});
mkdirSync(OUT, {recursive: true});

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=swiftshader', '--window-size=1700,1000'],
  defaultViewport: {width: 1700, height: 1000},
});

function bail(code, msg) {
  if (msg) console.error(msg);
  browser.close().catch(() => {});
  killTree(proc.pid);
  process.exit(code);
}

const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message));
await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});

try {
  await page.waitForFunction(RENDER_PREDICATE, {timeout: 120000, polling: 500});
} catch {
  const n = await page.evaluate(() => document.querySelectorAll('button').length).catch(() => -1);
  await page.screenshot({path: 'render-debug.png'}).catch(() => {});
  bail(1, `[render] Render button never appeared (buttons=${n}, errs=${errs.slice(0, 3).join(' | ')})`);
}
await sleep(500);

const clicked = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const isR = el => {
    const t = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim();
    return t.toLowerCase() === 'render';
  };
  const b = btns.find(el => isR(el) && /_main_/.test(el.className)) || btns.find(isR);
  if (b) {
    b.click();
    return true;
  }
  return false;
});
if (!clicked) bail(1, '[render] Render button not found at click time');
console.log('[render] render started...');

// 讀取渲染狀態：是否仍在渲染（主鈕為 Abort）+ 進度條寬度
const readState = () =>
  page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const rendering = btns.some(b => (b.textContent || '').trim().toLowerCase() === 'abort');
    const fill = document.querySelector('[class*="progressFill"]');
    const pct = fill ? fill.style.width || '' : '';
    return {rendering, pct};
  });

// 先確認真的進入渲染狀態
const start = Date.now();
let entered = false;
while (Date.now() - start < 30000) {
  if ((await readState()).rendering) {
    entered = true;
    break;
  }
  await sleep(500);
}
if (!entered) bail(1, '[render] render did not start (Abort state never seen)');

// 等到渲染結束（主鈕從 Abort 變回 Render）
let finished = false;
while (Date.now() - start < RENDER_TIMEOUT_MS) {
  await sleep(3000);
  const st = await readState();
  if (!st.rendering) {
    finished = true;
    break;
  }
  console.log(`[render] rendering... ${((Date.now() - start) / 1000).toFixed(0)}s  progress=${st.pct || '?'}`);
}
if (!finished) bail(1, '\n[render] FAILED: render did not finish within timeout');

// faststart 收尾寫檔，稍等再確認檔案
await sleep(4000);
const mp4 = latestMp4();
if (errs.length) console.log('[render] page errors:', errs.slice(0, 5).join(' | '));
if (mp4 && mp4.size > 1000) {
  console.log(`\n[render] DONE -> ${mp4.f} (${(mp4.size / 1e6).toFixed(1)} MB)`);
  bail(0);
} else {
  bail(1, `\n[render] FAILED: output mp4 missing/empty (${mp4 ? mp4.size + ' bytes' : 'none'})`);
}
