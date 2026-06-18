# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案目的

把 `Misere Tic-Tac-Toe.pdf`（反井字遊戲的證明）做成一支教學動畫影片，給「離散數學趣談」期末作業用。
用 [Motion Canvas](https://motioncanvas.io) 3.17 製作，輸出 1920×1080 / 30fps、全長約 2 分 57 秒的 mp4
（作業上限 12 分鐘）。動畫**無聲**；旁白由組員依 `script.md` 另外配音，成品影片放在雲端硬碟、不進版控。

## 常用指令

```bash
npm install      # 安裝相依套件（首次）
npm run serve    # 開編輯器預覽 http://localhost:9000/（改場景、校時用）
npm run render   # 自動輸出 output/project.mp4（見下方「渲染」注意事項）
```

沒有測試與 lint 設定；驗證方式是 `npm run serve` 預覽，或 `npm run render` 後檢查 `output/project.mp4`。

## 架構

- **`src/project.ts`** — 用 `makeProject` 依序註冊 9 個場景（`./scenes/NN-*?scene` 匯入）。場景順序＝影片順序。
- **`src/scenes/01..09`** — 每個 `.tsx` 是一個 `makeScene2D(function* (view) {…})`，對應 PDF 的一個段落：
  intro/規則 → N=1 → N=2 → N=3,4 → 結論總覽 → 奇數(先手不會輸,中心對稱) → 奇數(後手不會輸,分組)
  → 偶數 → 總結。動畫節奏用 `waitFor(秒)` 控制，要對齊 `script.md` 對應段落的旁白長度。
- **`src/components/Board.ts`（重點，務必重用）** — 共用棋盤元件，**程式化建立**（非 JSX）。提供
  `place(r,c,'A'|'B')` 落子動畫、`placeInstant`、`line(cells)` 畫連線、`group/groupAnim` 分組上色、
  `cellPos(r,c)` 取格子座標。要畫棋盤一律用它，不要自己重畫。
- **`src/theme.ts`** — 配色（**A=紅、B=藍**，對齊 PDF）、`FONT`（Microsoft JhengHei，繁中字型）、分組色盤。
- **`src/ui.ts`** — `title` / `caption` / `resultBadge`（如「先手必輸」「平手」）/ `bullet` 等共用文字節點。
- **`script.md`** — 逐字旁白稿，每段標好目標秒數；改動畫長度時要一起更新這裡。

## 重要慣例與「踩過的雷」

- **渲染設定在 `src/project.meta`**（已 commit）：exporter 設為 `@motion-canvas/ffmpeg`、rendering fps 30。
  不要改回預設的 image-sequence，否則輸出的是 png 序列而非 mp4。
- **`vite.config.ts` 的 CJS interop**：`motionCanvas`/`ffmpeg` plugin 在某些載入路徑下預設匯出被包成
  `{default: fn}`，所以用 `(import as any).default ?? import`。別「簡化」掉這行，否則 `npm run serve` 會壞。
- **`render.mjs`（headless 自動渲染——Motion Canvas 官方沒有 CLI 渲染，這是用 Puppeteer 驅動編輯器）**：
  - 需要本機裝 Google Chrome；路徑寫死在 `CHROME` 變數，換機器要改。
  - Render 按鈕的文字在 **`textContent`**（"Render"/"Abort"），不是 aria-label。
  - 完成判斷靠主按鈕由 **Abort → Render**；**不要**用檔案大小判斷：`+faststart` 會讓 mp4 在收尾前一直是 48 bytes。
  - Windows 下 vite 子行程要用 `taskkill /T` 整棵砍掉，否則殘留佔用 9000 埠。
  - ffmpeg 由 `@motion-canvas/ffmpeg` 自帶（`@ffmpeg-installer`），不需另裝系統 ffmpeg。
- **繁體中文**靠系統 CJK 字型（Windows 內建微軟正黑體）；在沒有中文字型的環境渲染會變豆腐字。
- **不進版控**：`node_modules/`、`output/`（mp4 可重新 render）。詳見 `.gitignore`。

## 改影片長度 / 內容

- 改某場景：編輯對應 `src/scenes/NN-*.tsx`，用 `npm run serve` 即時預覽。
- 要放慢/加長：增大該場景的 `waitFor(...)` 數值，並同步更新 `script.md` 的目標秒數與時間軸。
- 加新段落：在 `src/scenes/` 新增 scene 檔，並在 `src/project.ts` 依順序 import 註冊。
