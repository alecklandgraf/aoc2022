export default class Point {
  x: number;
  y: number;

  constructor(x: number, y: number);
  constructor(str: string);
  constructor(xy: [number, number]);
  constructor(x: number | string | [number, number], y?: number) {
    if (typeof x === 'string') {
      const [xStr, yStr] = x.replace(/[()]/g, '').split(',');
      this.x = Number(xStr);
      this.y = Number(yStr);
    } else if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x;
      this.y = y!;
    }
  }

  neighbors4() {
    return [
      new Point(this.x - 1, this.y),
      new Point(this.x + 1, this.y),
      new Point(this.x, this.y - 1),
      new Point(this.x, this.y + 1),
    ];
  }

  neighbors8() {
    return [
      new Point(this.x - 1, this.y - 1),
      new Point(this.x - 1, this.y),
      new Point(this.x - 1, this.y + 1),
      new Point(this.x, this.y - 1),
      new Point(this.x, this.y + 1),
      new Point(this.x + 1, this.y - 1),
      new Point(this.x + 1, this.y),
      new Point(this.x + 1, this.y + 1),
    ];
  }

  toString() {
    return `(${this.x},${this.y})`;
  }

  static fromString(str: string) {
    const [x, y] = str.replace(/[()]/g, '').split(',').map(Number);
    return new Point(x, y);
  }
}
