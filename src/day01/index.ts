import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let max = 0;
  let sum = 0;
  const lines = input.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == "") {
      if (sum > max) max = sum;
      sum = 0;
    } else {
      sum += Number(lines[i]);
    }
  }
  return max;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const elves: number[] = [];
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == "") {
      elves.push(sum);
      sum = 0;
    } else {
      sum += Number(lines[i]);
    }
    // last line
    if (i == lines.length - 1) {
      elves.push(sum);
    }
  }

  const [a, b, c] = elves.sort((a, b) => a - b).reverse();
  return a + b + c;
};

run({
  part1: {
    tests: [
      {
        input: `
          1000
          2000
          3000

          4000

          5000
          6000

          7000
          8000
          9000

          10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          1000
          2000
          3000

          4000

          5000
          6000

          7000
          8000
          9000

          10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
