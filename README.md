# 反井字遊戲教學影片（Motion Canvas）

離散數學趣談期末作業。用 [Motion Canvas](https://motioncanvas.io) 把 `Misere Tic-Tac-Toe.pdf`
的證明做成動畫，輸出 1920×1080、30fps 的影片，全長約 **2 分 57 秒**（上限 12 分鐘）。

## 成品
- 影片：`output/project.mp4`
- 旁白逐字稿：`script.md`（請組員照稿配音；動畫無聲，配音後合成即可）

## 開發 / 修改
```bash
npm install        # 安裝相依套件（首次）
npm run serve      # 開啟編輯器預覽：http://localhost:9000/
```
- 場景在 `src/scenes/`（01～09，依序對應 PDF 內容）。
- 共用棋盤元件：`src/components/Board.ts`（落子、連線、分組上色）。
- 配色與字型：`src/theme.ts`；標題/字幕/結論標籤：`src/ui.ts`。
- 渲染設定（FFmpeg 輸出、30fps）存在 `src/project.meta`。

## 重新輸出影片
```bash
npm run render     # 自動啟動伺服器 → 無頭 Chrome 觸發 Render → 產出 output/project.mp4
```
`render.mjs` 用 Puppeteer 驅動編輯器的 Render 鈕，需要本機已安裝 Google Chrome
（路徑寫死在 `render.mjs` 的 `CHROME` 變數，必要時自行調整）。ffmpeg 由
`@motion-canvas/ffmpeg` 自帶，不需另外安裝。

## 配音與合成
1. 依 `script.md` 各場景的目標秒數錄製旁白。
2. 用任意剪輯軟體把旁白音軌疊到 `output/project.mp4` 上即可。
   （若想嵌入 Motion Canvas 一起輸出，可把 mp3 設為專案 audio 後在輸出時勾選 include audio。）
