import {makeScene2D} from '@motion-canvas/2d';
import {waitFor, all} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS} from '../theme';
import {title, caption, resultBadge} from '../ui';

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('N = 1');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const board = new Board(1, {cellSize: 240});
  board.node.position([0, 0]);
  board.node.opacity(0);
  view.add(board.node);
  yield* board.node.opacity(1, 0.6);

  const cap = caption('棋盤只有一格，Alice 只有一種下法', {y: 320});
  view.add(cap);
  yield* cap.opacity(1, 0.6);
  yield* waitFor(3.4);

  // Alice 被迫落子，立刻形成 1 子連線
  yield* board.place(0, 0, 'A', 0.6);
  yield* board.line([[0, 0], [0, 0]], COLORS.line, 0.1);
  yield* cap.text('一下子就連成 1 子一線 —— 立刻輸掉', 0.4);
  yield* waitFor(2.1);

  const badge = resultBadge('先手必輸', COLORS.lose, {y: 340});
  view.add(badge);
  yield* all(cap.opacity(0, 0.4), badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(3.4);

  yield* all(head.opacity(0, 0.6), board.node.opacity(0, 0.6), badge.opacity(0, 0.6));
});
