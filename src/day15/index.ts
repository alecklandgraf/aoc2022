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
  minX: number,
  maxX: number,
  maxDistance: number,
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

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const rowToCheck =
    input[0] === 'Sensor at x=2, y=18: closest beacon is at x=-2, y=15'
      ? 10
      : 2000000;

  const { sensors, beacons } = parseInputToSensors(input, rowToCheck);
  // const minX = Math.min(
  //   ...sensors.map((sensor) => Math.min(sensor.x, sensor.beacon.x)),
  // );
  // const maxX = Math.max(
  //   ...sensors.map((sensor) => Math.max(sensor.x, sensor.beacon.x)),
  // );
  // const minY = Math.min(
  //   ...sensors.map((sensor) => Math.min(sensor.y, sensor.beacon.y)),
  // );
  // const maxY = Math.max(
  //   ...sensors.map((sensor) => Math.max(sensor.y, sensor.beacon.y)),
  // );
  // const maxDistance = Math.max(...sensors.map((sensor) => sensor.distance));

  // console.log({ minX, maxX, minY, maxY, maxDistance });
  // console.log(sensors);

  const row = new Set<number>();

  for (const sensor of sensors) {
    // console.log(sensor);
    sensorReachRow(sensor, rowToCheck, 0, 0, 0, row, beacons);
  }
  // for (const sensor of sensors) {
  //   if (sensor.y === rowToCheck && row.has(sensor.x)) row.delete(sensor.x);
  // }
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
  // onlyTests: true,
});
