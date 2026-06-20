import {makeScene2D, Txt, Layout} from '@motion-canvas/2d';
import {waitFor, all, sequence} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';
import {title, resultBadge} from '../ui';

function point(text: string): Txt {
  return new Txt({
    text,
    fill: COLORS.text,
    fontFamily: FONT,
    fontWeight: 500,
    fontSize: 44,
    opacity: 0,
  });
}

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const head = title('總結');
  view.add(head);
  yield* head.opacity(1, 0.6);

  const points = [
    point('● N = 1、2：先手必輸'),
    point('● N ≥ 3：雙方平手'),
    point('● 先手策略：佔中心 ＋ 中心對稱（奇數）'),
    point('● 後手策略：把格子兩兩「分組」配對'),
  ];
  const list = new Layout({direction: 'column', layout: true, gap: 32, alignItems: 'start', y: -40});
  points.forEach(p => list.add(p));
  view.add(list);
  yield* sequence(1.5, ...points.map(p => p.opacity(1, 0.4)));
  yield* waitFor(7);

  const badge = resultBadge('只要雙方都聰明，N ≥ 3 永遠平手', COLORS.draw, {y: 280});
  view.add(badge);
  yield* all(badge.opacity(1, 0.6), badge.scale(1, 0.6));
  yield* waitFor(8.5);

  const thanks = new Txt({
    text: '謝謝觀看！',
    fill: COLORS.accent,
    fontFamily: FONT,
    fontWeight: 800,
    fontSize: 80,
    y: 430,
    opacity: 0,
  });
  view.add(thanks);
  yield* thanks.opacity(1, 0.6);
  yield* waitFor(7.2);

  yield* all(head.opacity(0, 0.6), list.opacity(0, 0.6), badge.opacity(0, 0.6), thanks.opacity(0, 0.6));
});
