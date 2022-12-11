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
  visited: Set<string>,
  height = 5,
  width = 6,
  head: Complex,
  tail: Complex[] | Complex,
  offsetX = 0,
  offsetY = 0,
) {
  for (let y = height - 1; y >= 0; y--) {
    let line = '';
    let _tail: Complex[] = [];
    if (!Array.isArray(tail)) {
      _tail = [tail];
    } else {
      _tail = tail;
    }
    for (let x = 0; x < width; x++) {
      if (
        _tail.some(
          (t) =>
            t.toVector().join(',') === [x - offsetX, y - offsetY].join(','),
        )
      ) {
        line += 'T';
      } else if (
        head.toVector().join(',') === [x - offsetX, y - offsetY].join(',')
      ) {
        line += 'H';
      } else if (visited.has([x - offsetX, y - offsetY].join(','))) {
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

function countPathTail(input: line[]) {
  const tailLength = 9;
  // e.g. visited<'${x},${y}'> {'0,0', '0,1', '0,2'}
  const visited = new Set<string>(['0,0']);
  let head = Complex(0, 0);
  const tail = _.times(tailLength).map((_n) => Complex(0, 0));
  const directions = {
    R: Complex(1, 0),
    L: Complex(-1, 0),
    U: Complex(0, 1),
    D: Complex(0, -1),
  } as const;
  for (let step of input as line[]) {
    const direction = step[0] as keyof typeof directions;
    const distance = Number(step.slice(1));
    for (let _move of _.times(distance)) {
      head = head.add(directions[direction]);
      let currentHead = head;
      for (let [i, part] of tail.entries()) {
        const diff = currentHead.sub(part);
        // the tail needs to move
        if (diff.toVector().map(Math.abs).includes(2)) {
          // handle rounding of negative numbers
          if (diff.re === -1) diff.re = -2;
          if (diff.im === -1) diff.im = -2;
          tail[i] = diff.div(2).round(0).add(part);
          if (i === tailLength - 1) visited.add(tail[i].toVector().join(','));
        }
        currentHead = part;
      }
    }
  }
  // catch tail up
  for (let i = 0; i < tailLength; i++) {
    let currentHead = tail[0];
    for (let [i, part] of tail.entries()) {
      const diff = currentHead.sub(part);
      // the tail needs to move
      if (diff.toVector().map(Math.abs).includes(2)) {
        // handle rounding of negative numbers
        if (diff.re === -1) diff.re = -2;
        if (diff.im === -1) diff.im = -2;
        tail[i] = diff.div(2).round(0).add(part);
        if (i === tailLength - 1) visited.add(tail[i].toVector().join(','));
      }
      currentHead = part;
    }
  }

  // console.log(visited);
  return { visited, head, tail };
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
  // console.log({ maxX, maxY, minX, minY });
  const updatedVisited = new Set<string>(
    visitedArr.map((v) => `${v[0] - minX + 1},${v[1] - minY}`),
  );
  // printBridge(updatedVisited, maxY - minY + 2, maxX - minX + 3);

  return visited.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput) as line[];
  const { visited, head, tail } = countPathTail(input);
  const visitedArr = [...visited].map((v) => v.split(',').map(Number));
  const maxX = Math.max(...visitedArr.map((v) => v[0]));
  const maxY = Math.max(...visitedArr.map((v) => v[1]));
  const minX = Math.min(...visitedArr.map((v) => v[0]));
  const minY = Math.min(...visitedArr.map((v) => v[1]));
  console.log({ maxX, maxY, minX, minY });
  const updatedVisited = new Set<string>(
    visitedArr.map((v) => `${v[0] - minX + 1},${v[1] - minY}`),
  );
  // need a larger offset because the head and tail might not be in the visited set
  const offsetX = Math.abs(minX) + 5;
  const offsetY = Math.abs(minY) + 1;
  // printBridge(updatedVisited, maxY - minY + 2, maxX - minX + 3);
  // printBridge(visited, 25, 25, head, tail, offsetX, offsetY);
  // console.log(head.toVector(), tail, offsetX, offsetY);

  return visited.size;
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
      {
        input: `
        R 5
        U 8
        L 8
        D 3
        R 17
        D 10
        L 25
        U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
