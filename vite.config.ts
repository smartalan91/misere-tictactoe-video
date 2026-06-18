import {defineConfig} from 'vite';
import motionCanvasImport from '@motion-canvas/vite-plugin';
import ffmpegImport from '@motion-canvas/ffmpeg';

// CJS/ESM interop：某些載入路徑下預設匯出會被包成 { default: fn }
const motionCanvas: any = (motionCanvasImport as any).default ?? motionCanvasImport;
const ffmpeg: any = (ffmpegImport as any).default ?? ffmpegImport;

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
});
