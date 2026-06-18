import {Rect, Txt, Line, Node} from '@motion-canvas/2d';
import {all, waitFor, easeOutBack, Vector2} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

export type Player = 'A' | 'B';

export interface BoardOptions {
  cellSize?: number;
  lineWidth?: number;
}

/**
 * 共用棋盤元件：建立 N×N 棋格，並提供落子、標連線、分組上色等動畫 helper。
 * 以程式化方式建立節點，scene 只要 `view.add(board.node)` 即可。
 */
export class Board {
  public readonly node: Node;
  public readonly n: number;
  public readonly cellSize: number;
  private readonly cells: Rect[][] = [];
  private readonly marks: Txt[][] = [];

  constructor(n: number, opts: BoardOptions = {}) {
    this.n = n;
    this.cellSize = opts.cellSize ?? Math.min(140, Math.floor(700 / n));
    const lw = opts.lineWidth ?? 3;
    this.node = new Node({});

    for (let r = 0; r < n; r++) {
      this.cells[r] = [];
      this.marks[r] = [];
      for (let c = 0; c < n; c++) {
        const [x, y] = this.cellPos(r, c);
        const cell = new Rect({
          width: this.cellSize,
          height: this.cellSize,
          x,
          y,
          fill: COLORS.panel,
          stroke: COLORS.gridLine,
          lineWidth: lw,
          radius: 4,
        });
        const mark = new Txt({
          text: '',
          fill: COLORS.text,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: this.cellSize * 0.5,
          opacity: 0,
        });
        cell.add(mark);
        this.node.add(cell);
        this.cells[r][c] = cell;
        this.marks[r][c] = mark;
      }
    }
  }

  /** 棋格中心座標（相對 board 節點，board 置中於原點） */
  cellPos(r: number, c: number): [number, number] {
    const off = (this.n - 1) / 2;
    return [(c - off) * this.cellSize, (r - off) * this.cellSize];
  }

  cell(r: number, c: number): Rect {
    return this.cells[r][c];
  }

  private colorFor(p: Player) {
    return p === 'A' ? COLORS.alice : COLORS.bob;
  }
  private softFor(p: Player) {
    return p === 'A' ? COLORS.aliceSoft : COLORS.bobSoft;
  }

  /** 落子動畫：填淡色底 + 浮現字母 */
  *place(r: number, c: number, p: Player, dur = 0.4) {
    const cell = this.cells[r][c];
    const mark = this.marks[r][c];
    mark.text(p);
    mark.fill(this.colorFor(p));
    mark.scale(0.4);
    yield* all(
      cell.fill(this.softFor(p), dur),
      cell.stroke(this.colorFor(p), dur),
      mark.opacity(1, dur),
      mark.scale(1, dur, easeOutBack),
    );
  }

  /** 立即落子（不動畫，用於擺好初始局面） */
  placeInstant(r: number, c: number, p: Player) {
    const cell = this.cells[r][c];
    const mark = this.marks[r][c];
    mark.text(p);
    mark.fill(this.colorFor(p));
    mark.opacity(1);
    cell.fill(this.softFor(p));
    cell.stroke(this.colorFor(p));
  }

  /** 清空某格 */
  clear(r: number, c: number) {
    const cell = this.cells[r][c];
    const mark = this.marks[r][c];
    mark.opacity(0);
    mark.text('');
    cell.fill(COLORS.panel);
    cell.stroke(COLORS.gridLine);
  }

  /** 在一組棋格中心畫出連線 */
  *line(cells: [number, number][], color = COLORS.line, dur = 0.6) {
    const pts = cells.map(([r, c]) => new Vector2(...this.cellPos(r, c)));
    const a = pts[0];
    const b = pts[pts.length - 1];
    const dir = b.sub(a).normalized;
    const ext = this.cellSize * 0.45;
    const line = new Line({
      points: [a.sub(dir.scale(ext)), b.add(dir.scale(ext))],
      stroke: color,
      lineWidth: 10,
      lineCap: 'round',
      opacity: 0,
      end: 0,
      shadowColor: color,
      shadowBlur: 16,
    });
    this.node.add(line);
    line.opacity(1);
    yield* line.end(1, dur);
    return line;
  }

  /** 分組上色：把同組兩格填同色並標數字 */
  group(cells: [number, number][], color: string, label: string) {
    for (const [r, c] of cells) {
      const cell = this.cells[r][c];
      cell.fill(color + '40');
      cell.stroke(color);
      const mark = this.marks[r][c];
      mark.text(label);
      mark.fill(color);
      mark.fontSize(this.cellSize * 0.42);
      mark.opacity(1);
    }
  }

  /** 同組上色動畫版 */
  *groupAnim(cells: [number, number][], color: string, label: string, dur = 0.4) {
    const tasks = [];
    for (const [r, c] of cells) {
      const cell = this.cells[r][c];
      const mark = this.marks[r][c];
      mark.text(label);
      mark.fill(color);
      mark.fontSize(this.cellSize * 0.42);
      mark.scale(0.4);
      tasks.push(
        cell.fill(color + '40', dur),
        cell.stroke(color, dur),
        mark.opacity(1, dur),
        mark.scale(1, dur, easeOutBack),
      );
    }
    yield* all(...tasks);
  }
}
