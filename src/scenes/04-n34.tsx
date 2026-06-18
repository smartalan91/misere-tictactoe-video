import {makeScene2D} from '@motion-canvas/2d';
import {waitFor, all, sequence} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS} from '../theme';
import {title, caption, resultBadge} from '../ui';

// 一個 3×3 填滿、沒有任何單色三連線的「平手」終局
const DRAW3: ('A' | 'B')[][] = [
  ['A', 'B', 'A'],
  ['A', 'B', 'B'],
  ['B', 'A', 'A'],
];

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('N = 3、4');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const cap = caption('格子數不多，全部局面有限 —— 可用電腦「枚舉 / Min-Max」搜尋所有下法', {y: 380});
  view.add(cap);
  yield* cap.opacity(1, 0.6);
  yield* waitFor(3);

  const board = new Board(3, {cellSize: 160});
  board.node.position([0, 10]);
  board.node.opacity(0);
  view.add(board.node);
  yield* board.node.opacity(1, 0.5);

  // 依序把棋盤填滿，呈現一個沒人連線的終局
  const moves: [number, number, 'A' | 'B'][] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) moves.push([r, c, DRAW3[r][c]]);
  yield* sequence(0.18, ...moves.map(([r, c, p]) => board.place(r, c, p, 0.3)));
  yield* waitFor(1);

  yield* cap.text('雙方都採最佳策略時，沒有人會被迫先連線', 0.4);
  yield* waitFor(2);

  const badge = resultBadge('雙方平手', COLORS.draw, {y: 360});
  view.add(badge);
  yield* all(cap.opacity(0, 0.4), badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(2.5);

  yield* all(head.opacity(0, 0.6), board.node.opacity(0, 0.6), badge.opacity(0, 0.6));
});
