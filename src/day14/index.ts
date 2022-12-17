import run from 'aocrunner';
import _ from 'lodash';

import Point from '../utils/point.js';

const parseInput = (rawInput: string) => rawInput.split('\n');

function createCave(input: string[]) {
  const cave: Set<string> = new Set();
  for (const line of input) {
    const points = line.split(' -> ').map(Point.fromString);
    let previousPoint = points[0];
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const [minX, maxX] = [previousPoint.x, point.x].sort((a, b) => a - b);
      const [minY, maxY] = [previousPoint.y, point.y].sort((a, b) => a - b);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          cave.add(new Point(x, y).toString());
        }
      }
      previousPoint = point;
    }
  }
  return cave;
}

function printCave(cave: Set<string>, startingPoint: Point) {
  const minX = Math.min(
    ...[...cave].map((p) => Point.fromString(p).x),
    startingPoint.x,
  );
  const maxX = Math.max(...[...cave].map((p) => Point.fromString(p).x));
  const minY = Math.min(
    ...[...cave].map((p) => Point.fromString(p).y),
    startingPoint.y,
  );
  const maxY = Math.max(...[...cave].map((p) => Point.fromString(p).y));
  for (let y = minY; y <= maxY; y++) {
    let line = '';
    for (let x = minX; x <= maxX; x++) {
      if (x === startingPoint.x && y === startingPoint.y) {
        line += '+';
      } else {
        line += cave.has(new Point(x, y).toString()) ? '#' : '.';
      }
    }
    console.log(line);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const startingPoint = new Point(500, 0);
  const cave = createCave(input);
  // console.log(cave);
  printCave(cave, startingPoint);

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: '24',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: '',
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
