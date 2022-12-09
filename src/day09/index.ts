import run from 'aocrunner';
import chalk from 'chalk';
import Complex from 'complex.js';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('\n');
type line = `${'R' | 'L' | 'U' | 'D'} ${number}`;

/**
 * Print something like this 
    ......
    ......
    ......
    ......
    sTH...
 */
function printBridge(
  head: [number, number],
  tail: [number, number],
  visited: Set<string>,
  height = 5,
  width = 6,
  offsetX = 0,
  offsetY = 0,
) {
  const start = 's';
  for (let y = height - 1; y >= 0; y--) {
    let line = '';
    for (let x = 0; x < width; x++) {
      if (x === head[0] && y === head[1]) {
        line += 'H';
      } else if (x === tail[0] && y === tail[1]) {
        line += 'T';
      } else if (x === 0 && y === 0) {
        line += start;
      } else if (visited.has([x, y].join(','))) {
        line += '#';
      } else {
        line += '.';
      }
    }
    console.log(line);
  }
}

function countPath(input: line[]) {
  // e.g. visited<'${x},${y}'> {'0,0', '0,1', '0,2'}
  const visited = new Set<string>(['0,0']);
  let head = Complex(0, 0);
  let tail = Complex(0, 0);
  const directions = {
    R: Complex(1, 0),
    L: Complex(-1, 0),
    U: Complex(0, 1),
    D: Complex(0, -1),
  } as const;
  for (let step of input as line[]) {
    const direction = step[0] as 'R' | 'L' | 'U' | 'D';
    const distance = Number(step.slice(1));
    for (let _move of _.times(distance)) {
      head = head.add(directions[direction]);
      const diff = head.sub(tail);
      // the tail needs to move
      if (diff.toVector().map(Math.abs).includes(2)) {
        // handle rounding of negative numbers
        if (diff.re === -1) diff.re = -2;
        if (diff.im === -1) diff.im = -2;
        tail = diff.div(2).round(0).add(tail);
        visited.add(tail.toVector().join(','));
      }
      // console.log({
      //   step: step,
      //   head: head.toVector().join(','),
      //   tail: tail.toVector().join(','),
      //   diff: diff.toVector().join(','),
      //   shouldMove: diff.toVector().map(Math.abs).includes(2),
      // });
    }
  }
  // console.log(visited);
  return visited;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput) as line[];
  // console.log(chalk.bold.yellowBright('input'), input);
  const visited = countPath(input);
  const visitedArr = [...visited].map((v) => v.split(',').map(Number));
  const maxX = Math.max(...visitedArr.map((v) => v[0]));
  const maxY = Math.max(...visitedArr.map((v) => v[1]));
  const minX = Math.min(...visitedArr.map((v) => v[0]));
  const minY = Math.min(...visitedArr.map((v) => v[1]));
  console.log({ maxX, maxY, minX, minY });
  const updatedVisited = new Set<string>(
    visitedArr.map((v) => `${v[0] - minX + 1},${v[1] - minY}`),
  );
  // printBridge(
  //   [-1, -1],
  //   [-1, -1],
  //   updatedVisited,
  //   maxY - minY + 2,
  //   maxX - minX + 3,
  // );

  return visited.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput) as line[];

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
