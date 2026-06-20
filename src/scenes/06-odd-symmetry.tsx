import {makeScene2D, Line} from '@motion-canvas/2d';
import {waitFor, all, sequence, Vector2} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS} from '../theme';
import {title, caption, resultBadge, bullet} from '../ui';

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('N 為奇數：先手不會輸');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const board = new Board(5, {cellSize: 120});
  board.node.position([0, 30]);
  board.node.opacity(0);
  view.add(board.node);
  yield* board.node.opacity(1, 0.6);

  const cap = caption('策略：先手第一步，先佔正中心', {y: 410});
  view.add(cap);
  yield* cap.opacity(1, 0.5);
  yield* waitFor(2.7);
  yield* board.place(2, 2, 'A', 0.6);
  yield* waitFor(2.7);

  yield* cap.text('之後，後手下哪一格，先手就下「關於中心點對稱」的那一格', 0.4);
  yield* waitFor(3.5);

  // 對稱箭頭 helper：從後手格 → 經過中心 → 先手鏡像格
  const arrows: Line[] = [];
  function* mirror(from: [number, number]) {
    const to: [number, number] = [4 - from[0], 4 - from[1]];
    yield* board.place(from[0], from[1], 'B', 0.4);
    const p1 = new Vector2(...board.cellPos(...from));
    const p2 = new Vector2(...board.cellPos(...to));
    const line = new Line({
      points: [p1, new Vector2(0, 0), p2],
      stroke: COLORS.arrow,
      lineWidth: 7,
      endArrow: true,
      arrowSize: 18,
      radius: 50,
      opacity: 0,
      end: 0,
    });
    board.node.add(line);
    arrows.push(line);
    yield* all(line.opacity(1, 0.3), line.end(1, 0.5));
    yield* board.place(to[0], to[1], 'A', 0.4);
    yield* waitFor(1.1);
  }

  yield* mirror([0, 3]);
  yield* mirror([3, 0]);
  yield* waitFor(1.8);
  yield* all(...arrows.map(a => a.opacity(0, 0.4)));

  // 移到左邊，右邊列出「為什麼不會輸」
  yield* all(board.node.position([-470, 30], 0.7), cap.opacity(0, 0.4));

  const b1 = bullet(
    '● 通過中心的線：一定同時有雙方的棋子（中心是先手、對稱的另一格是後手），不可能單色連線。',
    {size: 36},
  );
  const b2 = bullet(
    '● 不通過中心的線：若先手能連成，代表後手在上一步「對稱位置」早就連成了 —— 輪不到先手先連。',
    {size: 36},
  );
  b1.position([430, -60]);
  b2.position([430, 110]);
  b1.maxWidth(840);
  b2.maxWidth(840);
  view.add(b1);
  view.add(b2);
  yield* sequence(1.5, b1.opacity(1, 0.5), b2.opacity(1, 0.5));
  yield* waitFor(5.3);

  const badge = resultBadge('先手不會輸', COLORS.draw, {y: 400});
  badge.position([430, 320]);
  view.add(badge);
  yield* all(badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(4.4);

  yield* all(
    head.opacity(0, 0.6),
    board.node.opacity(0, 0.6),
    b1.opacity(0, 0.6),
    b2.opacity(0, 0.6),
    badge.opacity(0, 0.6),
  );
});
