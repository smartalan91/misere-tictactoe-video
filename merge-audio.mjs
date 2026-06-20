import {spawnSync} from 'child_process';
import {existsSync, mkdirSync} from 'fs';
import {resolve} from 'path';

const ffmpeg = resolve('node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const video = resolve('output/project.mp4');
const output = resolve('output/project-with-voice.mp4');

const audioFiles = Array.from({length: 9}, (_, index) =>
  resolve('assets', `scene${index + 1}.m4a`),
);

const missing = [
  ffmpeg,
  video,
  ...audioFiles,
].filter(path => !existsSync(path));

if (missing.length) {
  console.error('[merge-audio] Missing required files:');
  for (const path of missing) console.error(`  ${path}`);
  process.exit(1);
}

mkdirSync(resolve('output'), {recursive: true});

const audioLabels = audioFiles.map((_, index) => `[${index + 1}:a]`).join('');
const filter = `${audioLabels}concat=n=${audioFiles.length}:v=0:a=1[a]`;
const args = [
  '-y',
  '-i', video,
  ...audioFiles.flatMap(path => ['-i', path]),
  '-filter_complex', filter,
  '-map', '0:v:0',
  '-map', '[a]',
  '-c:v', 'copy',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-movflags', '+faststart',
  output,
];

const result = spawnSync(ffmpeg, args, {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(`\n[merge-audio] DONE -> ${output}`);
