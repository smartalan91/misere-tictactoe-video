import {makeScene2D, Line} from '@motion-canvas/2d';
import {waitFor, all, sequence, Vector2} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS} from '../theme';
import {title, caption, resultBadge, bullet} from '../ui';

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('N 為偶數：也是平手');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const board = new Board(4, {cellSize: 130});
  board.node.position([0, 20]);
  board.node.opacity(0);
  view.add(board.node);
  yield* board.node.opacity(1, 0.6);

  const cap = caption('偶數棋盤沒有「正中心格」，改由後手當鏡像方：先手下哪，後手就下中心對稱位置', {y: 400});
  view.add(cap);
  yield* cap.opacity(1, 0.5);
  yield* waitFor(2.5);

  const arrows: Line[] = [];
  function* mirror(from: [number, number]) {
    const to: [number, number] = [3 - from[0], 3 - from[1]];
    yield* board.place(from[0], from[1], 'A', 0.4);
    const line = new Line({
      points: [new Vector2(...board.cellPos(...from)), new Vector2(...board.cellPos(...to))],
      stroke: COLORS.arrow,
      lineWidth: 7,
      endArrow: true,
      arrowSize: 18,
      opacity: 0,
      end: 0,
    });
    board.node.add(line);
    arrows.push(line);
    yield* all(line.opacity(1, 0.3), line.end(1, 0.5));
    yield* board.place(to[0], to[1], 'B', 0.4);
    yield* waitFor(0.5);
  }
  yield* mirror([0, 1]);
  yield* mirror([1, 0]);
  yield* waitFor(1);
  yield* all(...arrows.map(a => a.opacity(0, 0.4)));

  yield* all(board.node.position([-450, 20], 0.7), cap.opacity(0, 0.4));

  const b1 = bullet('● 後手不會輸：用對稱策略（同奇數情形的鏡像論證）', {size: 38});
  const b2 = bullet('● 先手不會輸：用同樣的「分組」證明（偶數格子剛好兩兩成對）', {size: 38});
  b1.position([420, -40]);
  b2.position([420, 90]);
  b1.maxWidth(860);
  b2.maxWidth(860);
  view.add(b1);
  view.add(b2);
  yield* sequence(1.2, b1.opacity(1, 0.5), b2.opacity(1, 0.5));
  yield* waitFor(3);

  const badge = resultBadge('雙方平手', COLORS.draw, {y: 300});
  badge.position([420, 300]);
  view.add(badge);
  yield* all(badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(2.5);

  yield* all(
    head.opacity(0, 0.6),
    board.node.opacity(0, 0.6),
    b1.opacity(0, 0.6),
    b2.opacity(0, 0.6),
    badge.opacity(0, 0.6),
  );
});
