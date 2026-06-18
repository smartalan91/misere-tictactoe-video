import {makeScene2D, Txt} from '@motion-canvas/2d';
import {waitFor, all} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS, FONT} from '../theme';
import {title, caption, resultBadge} from '../ui';

function label(text: string, x: number, y: number): Txt {
  return new Txt({
    text,
    fill: COLORS.textDim,
    fontFamily: FONT,
    fontWeight: 600,
    fontSize: 38,
    x,
    y,
    opacity: 0,
  });
}

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('N = 2');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const cap = caption('利用旋轉與對稱，前兩步其實只有兩種情形', {y: 380});
  view.add(cap);
  yield* cap.opacity(1, 0.6);
  yield* waitFor(2);

  const left = new Board(2, {cellSize: 150});
  left.node.position([-380, -20]);
  left.node.opacity(0);
  const right = new Board(2, {cellSize: 150});
  right.node.position([380, -20]);
  right.node.opacity(0);
  view.add(left.node);
  view.add(right.node);

  const labL = label('情形一', -380, 200);
  const labR = label('情形二', 380, 200);
  view.add(labL);
  view.add(labR);

  yield* all(left.node.opacity(1, 0.5), right.node.opacity(1, 0.5));

  // 前兩步
  yield* all(left.place(0, 0, 'A'), right.place(0, 0, 'A'));
  yield* all(left.place(0, 1, 'B'), right.place(1, 1, 'B'));
  yield* all(labL.opacity(1, 0.4), labR.opacity(1, 0.4));
  yield* waitFor(2.5);

  yield* cap.text('接下來 Alice 第三步，不論下在哪一格…', 0.4);
  yield* waitFor(1.5);

  // 第三步：兩邊都被迫連線
  yield* all(left.place(1, 1, 'A'), right.place(0, 1, 'A'));
  yield* all(
    left.line([[0, 0], [1, 1]], COLORS.line),
    right.line([[0, 0], [0, 1]], COLORS.line),
  );
  yield* cap.text('…都會自己連成一線', 0.4);
  yield* waitFor(2);

  const badge = resultBadge('先手必輸', COLORS.lose, {y: 360});
  view.add(badge);
  yield* all(cap.opacity(0, 0.4), badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(2.5);

  yield* all(
    head.opacity(0, 0.6),
    left.node.opacity(0, 0.6),
    right.node.opacity(0, 0.6),
    labL.opacity(0, 0.6),
    labR.opacity(0, 0.6),
    badge.opacity(0, 0.6),
  );
});
