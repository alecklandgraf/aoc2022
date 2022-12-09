import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split('').map(Number));

function treeBlocked(x: number, y: number, forest: number[][]) {
  const row = forest[y];
  const treeVale = row[x];
  // console.log(x, y, row, treeVale);
  let treeVisibleLeft = true;
  let treeVisibleRight = true;
  let treeVisibleUp = true;
  let treeVisibleDown = true;
  for (let i = 0; i < row.length; i++) {
    if (x === i) continue;
    if (row[i] >= treeVale && i < x) {
      treeVisibleLeft = false;
    }
    if (row[i] >= treeVale && i > x) {
      treeVisibleRight = false;
    }
  }
  if (treeVisibleLeft || treeVisibleRight) return true;
  for (let i = 0; i < forest.length; i++) {
    if (y === i) continue;
    const row = forest[i];
    if (row[x] >= treeVale && i < y) {
      treeVisibleUp = false;
    }
    if (row[x] >= treeVale && i > y) {
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

function senicScore(x: number, y: number, forest: number[][]) {
  const row = forest[y];
  const treeVale = row[x];
  // console.log({ x, y, row, treeVale });

  let treeVisibleLeft = 0;
  let treeVisibleRight = 0;
  let treeVisibleUp = 0;
  let treeVisibleDown = 0;
  // check left
  for (let i = x - 1; i >= 0; i--) {
    treeVisibleLeft++;
    if (row[i] >= treeVale) {
      break;
    }
  }
  // check right
  for (let i = x + 1; i < row.length; i++) {
    treeVisibleRight++;
    if (row[i] >= treeVale) {
      break;
    }
  }
  // check up
  for (let i = y - 1; i >= 0; i--) {
    treeVisibleUp++;
    if (forest[i][x] >= treeVale) {
      break;
    }
  }
  // check down
  for (let i = y + 1; i < forest.length; i++) {
    treeVisibleDown++;
    if (forest[i][x] >= treeVale) {
      break;
    }
  }

  // console.log({
  //   treeVisibleLeft,
  //   treeVisibleRight,
  //   treeVisibleUp,
  //   treeVisibleDown,
  // });
  const scrore = [
    treeVisibleLeft,
    treeVisibleRight,
    treeVisibleUp,
    treeVisibleDown,
  ].reduce((acc, cur) => acc * cur, 1);
  console.log(
    `${row
      .map((t, i) => (i === x ? `\x1b[33m${t}\x1b[0m` : t))
      .join(' ')}: ${scrore}`,
  );

  return scrore;
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

  let max = 0;
  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input[y].length - 1; x++) {
      const treeScore = senicScore(x, y, input);
      if (treeScore > max) {
        max = treeScore;
      }
    }
  }

  return max;
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
      {
        input: `
        30373
        25512
        65332
        33549
        35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
