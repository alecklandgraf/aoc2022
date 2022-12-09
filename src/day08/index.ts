import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

function tree(x: number, y: number, forest: string[]) {
  const row = forest[y];
  return row.at(x);
}

function treeBlocked(x: number, y: number, forest: string[]) {
  const row = forest[y];
  const treeVale = Number(row.at(x));
  // console.log(x, y, row, treeVale);
  let treeVisibleLeft = true;
  let treeVisibleRight = true;
  let treeVisibleUp = true;
  let treeVisibleDown = true;
  for (let i = 0; i < row.length; i++) {
    if (x === i) continue;
    if (Number(row.at(i)) >= treeVale && i < x) {
      treeVisibleLeft = false;
    }
    if (Number(row.at(i)) >= treeVale && i > x) {
      treeVisibleRight = false;
    }
  }
  for (let i = 0; i < forest.length; i++) {
    if (y === i) continue;
    const row = forest[i];
    if (Number(row.at(x)) >= treeVale && i < y) {
      treeVisibleUp = false;
    }
    if (Number(row.at(x)) >= treeVale && i > y) {
      treeVisibleDown = false;
    }
  }

  return [
    treeVisibleLeft,
    treeVisibleRight,
    treeVisibleUp,
    treeVisibleDown,
  ].some(Boolean);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  // console.log(treeBlocked(3, 2, input));
  let sum = 0;
  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input[y].length - 1; x++) {
      if (treeBlocked(x, y, input)) {
        sum++;
      }
    }
  }

  return sum + 2 * input.length + 2 * input[0].length - 4;
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
        30373
        25512
        65332
        33549
        35390`,
        expected: 21,
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
  // onlyTests: true,
});
