import {Rect, Txt, Node, Layout} from '@motion-canvas/2d';
import {COLORS, FONT} from './theme';

/** 場景標題（畫面上方） */
export function title(text: string, opts: {y?: number; size?: number} = {}): Txt {
  return new Txt({
    text,
    fill: COLORS.text,
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: opts.size ?? 64,
    y: opts.y ?? -440,
    opacity: 0,
  });
}

/** 副標 / 說明字（可多行） */
export function caption(text: string, opts: {y?: number; size?: number; fill?: string} = {}): Txt {
  return new Txt({
    text,
    fill: opts.fill ?? COLORS.textDim,
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: opts.size ?? 40,
    y: opts.y ?? 380,
    opacity: 0,
    textWrap: true,
    textAlign: 'center',
    maxWidth: 1500,
    lineHeight: 56,
  });
}

/** 結論膠囊標籤，例如「先手必輸」「平手」 */
export function resultBadge(text: string, color: string, opts: {y?: number} = {}): Layout {
  const root = new Layout({y: opts.y ?? 0, opacity: 0, scale: 0.8});
  const pill = new Rect({
    fill: color + '22',
    stroke: color,
    lineWidth: 4,
    radius: 999,
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 20,
    paddingBottom: 20,
    layout: true,
  });
  pill.add(
    new Txt({
      text,
      fill: color,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 56,
    }),
  );
  root.add(pill);
  return root;
}

/** 一段重點文字（左對齊條列用） */
export function bullet(text: string, opts: {size?: number; fill?: string} = {}): Txt {
  return new Txt({
    text,
    fill: opts.fill ?? COLORS.text,
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: opts.size ?? 38,
    opacity: 0,
    textWrap: true,
    maxWidth: 760,
    lineHeight: 50,
  });
}

export function node(...children: Node[]): Node {
  const n = new Node({});
  children.forEach(c => n.add(c));
  return n;
}
