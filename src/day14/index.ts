import run from 'aocrunner';
import _ from 'lodash';

import Point from '../utils/point.js';

const COMPLETE = Symbol('COMPLETE');

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

function findBottom(
  cave: Set<string>,
  sandLocation: Point,
  infiniteFloor?: number,
): Point | typeof COMPLETE {
  const { y } = sandLocation;
  // console.log(cave, sandLocation);

  const hasBottom = infiniteFloor
    ? true
    : [...cave].some((p) => {
        const caveLocation = Point.fromString(p);
        return caveLocation.x === sandLocation.x && caveLocation.y > y;
      });
  if (!hasBottom) {
    console.log('no bottom');
    return COMPLETE;
  }
  const bottom = new Point(sandLocation.x, y + 1);
  // let the sand drop until it hits a cave floor or another sand floor
  while (!cave.has(bottom.toString()) && infiniteFloor !== bottom.y) {
    bottom.y += 1;
  }
  if (infiniteFloor === bottom.y) {
    bottom.y -= 1;
    return bottom;
  }

  // we hit a cave floor, we need to find the left and right edges of the sand
  // note the y is at the floor level, not where the sand will be
  const left = new Point(bottom.x - 1, bottom.y);
  const right = new Point(bottom.x + 1, bottom.y);
  if (cave.has(left.toString()) && cave.has(right.toString())) {
    // can't move left or right, we're done
    bottom.y -= 1;
    return bottom;
  }
  if (!cave.has(left.toString())) {
    // can move left
    return findBottom(cave, left, infiniteFloor);
  } else if (!cave.has(right.toString())) {
    // can move right
    return findBottom(cave, right, infiniteFloor);
  }

  console.log('should not get here');
  return COMPLETE;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const startingPoint = new Point(500, 0);
  // const sand: Set<string> = new Set();
  const cave = createCave(input);
  const wallSize = cave.size;
  // console.log(cave);
  // printCave(cave, startingPoint);
  let sand = findBottom(cave, startingPoint);
  let i = 0;
  while (sand !== COMPLETE && i++ < 1000) {
    cave.add(sand.toString());
    // printCave(cave, startingPoint);
    sand = findBottom(cave, startingPoint);
  }
  // printCave(cave, startingPoint);
  return cave.size - wallSize;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const startingPoint = new Point(500, 0);
  // const sand: Set<string> = new Set();
  const cave = createCave(input);
  const wallSize = cave.size;
  const maxY = Math.max(...[...cave].map((p) => Point.fromString(p).y));
  console.log(maxY + 2);
  // console.log(cave);
  // printCave(cave, startingPoint);
  let sand = findBottom(cave, startingPoint);
  let i = 0;
  while (sand !== COMPLETE && i++ < 100500 && sand.toString() !== '(500,0)') {
    cave.add(sand.toString());
    // printCave(cave, startingPoint);
    sand = findBottom(cave, startingPoint, maxY + 2);
  }
  // printCave(cave, startingPoint);
  console.log(sand, i);

  return i;
};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
