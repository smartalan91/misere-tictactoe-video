import {makeScene2D, Txt, Rect, Layout} from '@motion-canvas/2d';
import {waitFor, all, sequence} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';
import {title, resultBadge} from '../ui';

function row(n: string, result: string, color: string): Layout {
  const r = new Layout({layout: true, gap: 0, opacity: 0});
  const left = new Rect({
    width: 360,
    height: 88,
    fill: COLORS.panel,
    stroke: COLORS.gridLine,
    lineWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    layout: true,
  });
  left.add(new Txt({text: n, fill: COLORS.text, fontFamily: FONT, fontWeight: 600, fontSize: 44}));
  const right = new Rect({
    width: 420,
    height: 88,
    fill: color + '1f',
    stroke: COLORS.gridLine,
    lineWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    layout: true,
  });
  right.add(new Txt({text: result, fill: color, fontFamily: FONT, fontWeight: 700, fontSize: 44}));
  r.add(left);
  r.add(right);
  return r;
}

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('結論總覽');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const header = row('棋盤大小 N', '結果', COLORS.text);
  const rows = [
    header,
    row('N = 1', '先手必輸', COLORS.lose),
    row('N = 2', '先手必輸', COLORS.lose),
    row('N = 3、4', '雙方平手', COLORS.draw),
    row('N 為奇數（≥3）', '雙方平手', COLORS.draw),
    row('N 為偶數（≥4）', '雙方平手', COLORS.draw),
  ];
  const table = new Layout({direction: 'column', layout: true, y: -10, gap: 0});
  rows.forEach(r => table.add(r));
  view.add(table);

  yield* sequence(0.4, ...rows.map(r => r.opacity(1, 0.4)));
  yield* waitFor(2.5);

  const badge = resultBadge('N ≥ 3 一律平手', COLORS.draw, {y: 380});
  view.add(badge);
  yield* all(badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(2);

  const note = new Txt({
    text: '接下來證明一般情況：先手不會輸 + 後手不會輸 → 平手',
    fill: COLORS.textDim,
    fontFamily: FONT,
    fontSize: 36,
    y: 470,
    opacity: 0,
  });
  view.add(note);
  yield* note.opacity(1, 0.5);
  yield* waitFor(3);

  yield* all(head.opacity(0, 0.6), table.opacity(0, 0.6), badge.opacity(0, 0.6), note.opacity(0, 0.6));
});
