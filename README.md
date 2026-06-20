# 反井字遊戲教學影片（Motion Canvas）

離散數學趣談期末作業。用 [Motion Canvas](https://motioncanvas.io) 把 `Misere Tic-Tac-Toe.pdf`
的證明做成動畫，輸出 1920×1080、30fps 的影片，全長約 **4 分 22 秒**（上限 12 分鐘）。

## 成品
- 有聲影片：`output/project-with-voice.mp4`
- 無聲中間檔：`output/project.mp4`（由 render 產生，合成音訊時會用到）
- 旁白逐字稿：`script.md`
- 配音檔：`assets/scene1.m4a` ～ `assets/scene9.m4a`

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
npm run render         # 產出無聲中間檔 output/project.mp4
npm run merge-audio    # 合成 assets/scene*.m4a → output/project-with-voice.mp4
```

如果在 PowerShell 遇到 `npm.ps1` 未簽署的錯誤，改用：

```bash
cmd /c npm run merge-audio
```

`render.mjs` 用 Puppeteer 驅動 Motion Canvas 編輯器的 Render 鈕，會自動尋找 Google Chrome 或
Microsoft Edge。ffmpeg 由專案相依套件自帶，不需另外安裝。

## 配音與合成
1. 9 段配音放在 `assets/`，檔名為 `scene1.m4a` ～ `scene9.m4a`。
3. 跑 `npm run render` 產生無聲中間檔。
4. 跑 `npm run merge-audio` 產生最終有聲影片。

`output/` 不進版控；如果重新 clone 專案，照上面的兩個指令即可重新產生影片。
