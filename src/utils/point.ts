export default class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }

  static fromString(str: string) {
    const [x, y] = str.replace('(', '').replace(')', '').split(',').map(Number);
    return new Point(x, y);
  }
}
