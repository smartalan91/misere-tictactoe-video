import {makeScene2D, Line, Node, Rect} from '@motion-canvas/2d';
import {waitFor, all, sequence, Vector2} from '@motion-canvas/core';
import {Board} from '../components/Board';
import {COLORS, GROUP_PALETTE} from '../theme';
import {title, caption, resultBadge} from '../ui';

// PDF 中 5×5 的一組合法分組（每個編號兩格同組，(2,0) 為唯一沒編號的格子）
const GRID: (number | 0)[][] = [
  [6, 1, 1, 9, 12],
  [6, 7, 2, 2, 10],
  [0, 7, 11, 3, 3],
  [4, 12, 8, 11, 4],
  [5, 5, 8, 9, 10],
];

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('N 為奇數：後手不會輸（先手不會贏）');
  head.fontSize(52);
  view.add(head);
  yield* head.opacity(1, 0.6);

  const board = new Board(5, {cellSize: 120});
  board.node.position([0, 30]);
  board.node.opacity(0);
  view.add(board.node);
  yield* board.node.opacity(1, 0.6);

  const cap = caption('要證「先手不會贏」，只要證「後手不會輸」：後手有策略保證至少平手', {y: 410});
  view.add(cap);
  yield* cap.opacity(1, 0.5);
  yield* waitFor(5.5);

  // --- 2N+2 條線 ---
  yield* cap.text('5×5 棋盤上共有 2N+2 = 12 條線（5 列 + 5 行 + 2 對角線）', 0.4);
  const linesLayer = new Node({});
  board.node.add(linesLayer);
  const thin = (a: [number, number], b: [number, number], color: string) => {
    const p1 = new Vector2(...board.cellPos(...a));
    const p2 = new Vector2(...board.cellPos(...b));
    const dir = p2.sub(p1).normalized;
    const ext = board.cellSize * 0.4;
    const l = new Line({
      points: [p1.sub(dir.scale(ext)), p2.add(dir.scale(ext))],
      stroke: color,
      lineWidth: 4,
      opacity: 0,
      end: 0,
    });
    linesLayer.add(l);
    return l;
  };
  const lineNodes: Line[] = [];
  for (let r = 0; r < 5; r++) lineNodes.push(thin([r, 0], [r, 4], '#5dade2'));
  for (let c = 0; c < 5; c++) lineNodes.push(thin([0, c], [4, c], '#58d68d'));
  lineNodes.push(thin([0, 0], [4, 4], '#bb8fce'));
  lineNodes.push(thin([0, 4], [4, 0], '#bb8fce'));
  yield* sequence(0.12, ...lineNodes.map(l => all(l.opacity(0.75, 0.2), l.end(1, 0.3))));
  yield* waitFor(3.7);

  yield* cap.text('關鍵：只要「每條線上都同時有雙方棋子」，就沒人連線 → 平手', 0.4);
  yield* waitFor(5.5);
  yield* all(...lineNodes.map(l => l.opacity(0, 0.4)));

  // --- 分組 ---
  yield* cap.text('做法：把格子兩兩「分組」，讓每條線都至少含某一組的兩格', 0.4);
  yield* waitFor(3.7);

  // 依編號上色
  const groups = new Map<number, [number, number][]>();
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) {
      const v = GRID[r][c];
      if (v === 0) continue;
      if (!groups.has(v)) groups.set(v, []);
      groups.get(v)!.push([r, c]);
    }
  const anims = [...groups.entries()].map(([v, cells]) =>
    board.groupAnim(cells, GROUP_PALETTE[(v - 1) % GROUP_PALETTE.length], String(v), 0.3),
  );
  yield* sequence(0.18, ...anims);
  yield* waitFor(3.7);

  // 標出唯一沒編號的格子
  const emptyHi = new Rect({
    width: 120,
    height: 120,
    position: new Vector2(...board.cellPos(2, 0)),
    stroke: COLORS.accent,
    lineWidth: 6,
    radius: 6,
    opacity: 0,
  });
  board.node.add(emptyHi);
  yield* cap.text('每個編號代表「同一組的兩格」；只有黃框這格沒被編號', 0.4);
  yield* emptyHi.opacity(1, 0.4);
  yield* waitFor(5.5);

  // --- 後手策略示範 ---
  yield* cap.text('後手策略：先手下哪個編號，後手就下同編號的另一格', 0.4);
  yield* waitFor(3.7);
  yield* board.place(0, 1, 'A', 0.45); // 組 1
  yield* board.place(0, 2, 'B', 0.45);
  yield* waitFor(1.8);
  yield* board.place(3, 3, 'A', 0.45); // 組 11
  yield* board.place(2, 2, 'B', 0.45);
  yield* waitFor(2.7);

  yield* cap.text('每一組的兩格最後都是一紅一藍 → 每條線都混入雙方棋子 → 沒人能連成單色線', 0.4);
  yield* waitFor(6.4);

  // --- 沒編號格子的處理 ---
  yield* cap.text('若先手下「沒編號」的格子？N 為奇數時這種格子是奇數個，後手就跟著一起下；最後先手仍被迫回到編號格，照原策略即可', 0.4);
  yield* waitFor(8.2);

  // --- 7×7 以上 ---
  yield* cap.text('7×7 以上的奇數棋盤，也能用同樣規律構造出這種分組', 0.4);
  yield* waitFor(4.6);

  const badge = resultBadge('後手不會輸', COLORS.draw, {y: 410});
  view.add(badge);
  yield* all(cap.opacity(0, 0.3), badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(4.6);

  yield* all(head.opacity(0, 0.6), board.node.opacity(0, 0.6), badge.opacity(0, 0.6));
});
