import run from 'aocrunner';
import _ from 'lodash';
import { getNumbersFromString, manhattanDistance } from '../utils/index.js';

const parseInput = (rawInput: string) => rawInput.split('\n');
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `(${this.x},${this.y})`;
  }
}
class Beacon extends Point {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

class Sensor extends Point {
  beacon: Beacon;
  distance: number;
  constructor(x: number, y: number, beacon: Beacon) {
    super(x, y);
    this.beacon = beacon;
    this.distance = manhattanDistance(this, beacon);
  }
}

function parseInputToSensors(input: string[], y: number) {
  const sensors = [];
  const beacons: Set<number> = new Set();
  for (const line of input) {
    const [sx, sy, bx, by] = getNumbersFromString(line);
    sensors.push(new Sensor(sx, sy, new Beacon(bx, by)));

    if (by === y) beacons.add(bx);
  }

  return { sensors, beacons };
}
function sensorReachRow(
  sensor: Sensor,
  y: number,
  row: Set<number>,
  beacons: Set<number>,
) {
  const distanceToRow = manhattanDistance(sensor, { x: sensor.x, y });
  if (distanceToRow > sensor.distance) return;
  const range = sensor.distance - distanceToRow;
  for (let x = sensor.x - range; x <= sensor.x + range; x++) {
    if (!beacons.has(x)) {
      row.add(x);
    }
  }
}

function calculateRanges(sensors: Sensor[], y: number) {
  const ranges = [];
  for (const sensor of sensors) {
    const distanceToRow = manhattanDistance(sensor, { x: sensor.x, y });
    if (distanceToRow > sensor.distance) continue;
    const range = sensor.distance - distanceToRow;
    ranges.push([sensor.x - range, sensor.x + range]);
  }
  return ranges;
}

/**
 * https://javascript.plainenglish.io/javascript-algorithms-merge-intervals-leetcode-98da240805bc
 */
function mergeRanges(ranges: number[][]) {
  const mergedRanges: number[][] = [];
  ranges.sort((a, b) => a[0] - b[0]);
  let previous = ranges[0];
  for (let i = 1; i < ranges.length; i += 1) {
    // I added a `+ 1` here to make integer ranges inclusive: [ -2, 3 ], [ 4, 26 ] => [ -2, 26 ]
    if (previous[1] + 1 >= ranges[i][0]) {
      previous = [previous[0], Math.max(previous[1], ranges[i][1])];
    } else {
      mergedRanges.push(previous);
      previous = ranges[i];
    }
  }

  mergedRanges.push(previous);
  return mergedRanges;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const rowToCheck =
    input[0] === 'Sensor at x=2, y=18: closest beacon is at x=-2, y=15'
      ? 10
      : 2000000;

  const { sensors, beacons } = parseInputToSensors(input, rowToCheck);

  const row = new Set<number>();

  for (const sensor of sensors) {
    // console.log(sensor);
    sensorReachRow(sensor, rowToCheck, row, beacons);
  }
  // console.log('row', row);

  return row.size;
};

const part2 = (rawInput: string) => {
  const frequency = 4000000;
  const input = parseInput(rawInput);
  const { sensors, beacons } = parseInputToSensors(input, 10);
  const ranges = calculateRanges(sensors, 10);
  // console.log({
  //   ranges: _.sortBy(ranges, ([x]) => x),
  //   mergedRanges: mergeRanges(ranges),
  // });
  const mergedRanges = mergeRanges(_.sortBy(ranges, ([x]) => x))[0];
  let sensor: Sensor;
  const upperBound =
    input[0] === 'Sensor at x=2, y=18: closest beacon is at x=-2, y=15'
      ? 20
      : 4000000;
  for (let i = 0; i <= upperBound; i++) {
    const mergedRanges = mergeRanges(mergeRanges(calculateRanges(sensors, i)));
    // a more exhaustive check would be to check the bounds [0, upperBound] and see if the mergedRanges has a gap
    if (mergedRanges.length > 1) {
      console.log(i, mergedRanges);
      return (mergedRanges[0][1] + 1) * frequency + i;
    }
  }

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        Sensor at x=9, y=16: closest beacon is at x=10, y=16
        Sensor at x=13, y=2: closest beacon is at x=15, y=3
        Sensor at x=12, y=14: closest beacon is at x=10, y=16
        Sensor at x=10, y=20: closest beacon is at x=10, y=16
        Sensor at x=14, y=17: closest beacon is at x=10, y=16
        Sensor at x=8, y=7: closest beacon is at x=2, y=10
        Sensor at x=2, y=0: closest beacon is at x=2, y=10
        Sensor at x=0, y=11: closest beacon is at x=2, y=10
        Sensor at x=20, y=14: closest beacon is at x=25, y=17
        Sensor at x=17, y=20: closest beacon is at x=21, y=22
        Sensor at x=16, y=7: closest beacon is at x=15, y=3
        Sensor at x=14, y=3: closest beacon is at x=15, y=3
        Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        Sensor at x=9, y=16: closest beacon is at x=10, y=16
        Sensor at x=13, y=2: closest beacon is at x=15, y=3
        Sensor at x=12, y=14: closest beacon is at x=10, y=16
        Sensor at x=10, y=20: closest beacon is at x=10, y=16
        Sensor at x=14, y=17: closest beacon is at x=10, y=16
        Sensor at x=8, y=7: closest beacon is at x=2, y=10
        Sensor at x=2, y=0: closest beacon is at x=2, y=10
        Sensor at x=0, y=11: closest beacon is at x=2, y=10
        Sensor at x=20, y=14: closest beacon is at x=25, y=17
        Sensor at x=17, y=20: closest beacon is at x=21, y=22
        Sensor at x=16, y=7: closest beacon is at x=15, y=3
        Sensor at x=14, y=3: closest beacon is at x=15, y=3
        Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
