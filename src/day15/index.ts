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

function parseInputToSensors(input: string[]) {
  const sensors = [];
  for (const line of input) {
    const [sx, sy, bx, by] = getNumbersFromString(line);
    sensors.push(new Sensor(sx, sy, new Beacon(bx, by)));
  }

  return sensors;
}
function sensorReachRow(
  sensor: Sensor,
  y: number,
  minX: number,
  maxX: number,
  row: Set<string>,
): Set<string> {
  for (let x = minX; x <= maxX; x++) {
    if (manhattanDistance(sensor, { x, y }) <= sensor.distance) {
      row.add(`(${x},${y})`);
    }
  }
  return row;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const sensors = parseInputToSensors(input);
  const minX = Math.min(
    ...sensors.map((sensor) => Math.min(sensor.x, sensor.beacon.x)),
  );
  const maxX = Math.max(
    ...sensors.map((sensor) => Math.max(sensor.x, sensor.beacon.x)),
  );
  const minY = Math.min(
    ...sensors.map((sensor) => Math.min(sensor.y, sensor.beacon.y)),
  );
  const maxY = Math.max(
    ...sensors.map((sensor) => Math.max(sensor.y, sensor.beacon.y)),
  );
  const maxDistance = Math.max(...sensors.map((sensor) => sensor.distance));

  // console.log({ minX, maxX, minY, maxY });
  console.log(sensors);
  const rowToCheck = 10;
  const row = new Set<string>();
  for (const sensor of sensors) {
    sensorReachRow(sensor, rowToCheck, minX, maxX, row);
  }
  for (const sensor of sensors) {
    if (row.has(sensor.beacon.toString())) {
      row.delete(sensor.beacon.toString());
    }
  }
  // console.log(row);
  return row.size;
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
