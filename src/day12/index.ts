import run from 'aocrunner';
import chalk from 'chalk';

import { interpolateGnBu } from 'd3-scale-chromatic';
import {
  aStar,
  Node,
  manhattanDistance,
  getNumbersFromString,
} from '../utils/index.js';

const parseInput = (rawInput: string) => rawInput.split('\n');

function colorTuple(rbgs: number[]): [number, number, number] {
  return [rbgs[0], rbgs[1], rbgs[2]];
}

function colorize(str: string, weight: number) {
  return chalk.rgb(
    ...colorTuple(getNumbersFromString(interpolateGnBu(1 - weight / 26))),
  )(str);
}

function createGrid(input: string[]) {
  const grid: Node[][] = [];
  let start: Node | null = null;
  let end: Node | null = null;
  for (let y = 0; y < input.length; y++) {
    grid[y] = [];
    for (let x = 0; x < input[y].length; x++) {
      let node = {
        cost: input[y][x].charCodeAt(0) - 97,
        x: x,
        y: y,
        f: Infinity,
        g: Infinity,
        h: Infinity,
        parent: null,
        debug: input[y][x],
      };
      if (input[y][x] === 'S') {
        node.cost = 0;
        node.g = 0;
        start = node;
      }
      if (input[y][x] === 'E') {
        node.cost = 26;
        end = node;
      }
      grid[y][x] = node;
    }
  }

  return { grid, start, end };
}

function printGrid(grid: Node[][], path: Set<Node>) {
  const children = new Map<Node, Node>();
  for (let node of path) {
    if (node.parent) {
      children.set(node.parent, node);
    }
  }
  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[y].length; x++) {
      if (path.has(grid[y][x])) {
        const node = grid[y][x];
        const child = children.get(node);
        if (node.debug === 'S') {
          line += colorize('S', 0);
        } else if (node.debug === 'E') {
          line += colorize('E', 26);
        } else if (child?.x === x && child?.y === y - 1) {
          line += colorize('^', node.cost);
        } else if (child?.x === x && child?.y === y + 1) {
          line += colorize('v', node.cost);
        } else if (child?.x === x - 1 && child?.y === y) {
          line += colorize('<', node.cost);
        } else if (child?.x === x + 1 && child?.y === y) {
          line += colorize('>', node.cost);
        }
      } else {
        line += ' ';
      }
    }
    console.log(line);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { start, grid, end } = createGrid(input);
  const path = aStar(
    grid,
    start!,
    end!,
    manhattanDistance,
    (current, neighbor) =>
      current.cost <= neighbor.cost && neighbor.cost - current.cost > 1,
  );
  printGrid(grid, new Set(path));
  // console.log(
  //   'path',
  //   path.map(({ x, y, debug }) => `[${debug}](${x},${y})`).join(' -> '),
  // );

  console.log(colorize('test', 2));
  return path.length - 1;
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
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi`,
        expected: 31,
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
