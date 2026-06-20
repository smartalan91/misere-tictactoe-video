import {makeScene2D, Txt} from '@motion-canvas/2d';
import {all, waitFor, createRef} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS, FONT} from '../theme';
import {title, caption, resultBadge} from '../ui';

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  // --- 片頭標題 ---
  const t = new Txt({
    text: '反井字遊戲',
    fill: COLORS.text,
    fontFamily: FONT,
    fontWeight: 800,
    fontSize: 130,
    opacity: 0,
    y: -30,
  });
  const sub = new Txt({
    text: 'Misère Tic-Tac-Toe',
    fill: COLORS.accent,
    fontFamily: FONT,
    fontWeight: 500,
    fontSize: 56,
    opacity: 0,
    y: 80,
  });
  view.add(t);
  view.add(sub);
  yield* t.opacity(1, 0.8);
  yield* sub.opacity(1, 0.6);
  yield* waitFor(3);
  yield* all(t.opacity(0, 0.6), sub.opacity(0, 0.6));

  // --- 規則設定 ---
  const head = title('遊戲規則');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const board = new Board(3, {cellSize: 150});
  board.node.position([0, 20]);
  board.node.opacity(0);
  view.add(board.node);
  yield* board.node.opacity(1, 0.6);

  const cap = caption('N×N 棋盤：Alice 先手（紅 A），Bob 後手（藍 B），兩人輪流下子', {y: 360});
  view.add(cap);
  yield* cap.opacity(1, 0.6);
  yield* waitFor(6.4);

  // --- 一局示範：Alice 連成上排 ---
  yield* cap.text('當有 N 顆同色棋子連成一線，稱為「連線」', 0.4);
  yield* waitFor(3);

  yield* board.place(0, 0, 'A');
  yield* board.place(1, 1, 'B');
  yield* board.place(0, 1, 'A');
  yield* board.place(2, 1, 'B');
  yield* board.place(0, 2, 'A');
  yield* waitFor(0.6);
  yield* board.line([[0, 0], [0, 1], [0, 2]], COLORS.line);
  yield* waitFor(3);

  // --- 反轉規則 ---
  yield* cap.opacity(0, 0.4);
  const normal = caption('一般井字遊戲：先連線的人「獲勝」', {y: 330, fill: COLORS.textDim});
  view.add(normal);
  yield* normal.opacity(1, 0.5);
  yield* waitFor(4.5);

  const badge = resultBadge('在這個遊戲：先連線的人「輸」！', COLORS.lose, {y: 420});
  view.add(badge);
  yield* all(normal.opacity(0, 0.4), badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(6.1);

  yield* all(
    head.opacity(0, 0.6),
    board.node.opacity(0, 0.6),
    badge.opacity(0, 0.6),
  );
});
