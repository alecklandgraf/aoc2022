import run from 'aocrunner';
import { isSuperset, intersection } from '../utils/index.js';

const parseInput = (rawInput: string) => rawInput.split('\n');

function setFromInput(input: string) {
  const [start, end] = input.split('-').map(Number);

  const set = new Set<number>();
  for (let i = start; i <= end; i++) {
    set.add(i);
  }

  return set;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (const line of input) {
    const [firstSection, secondSection] = line.split(',').map(setFromInput);
    if (
      isSuperset(firstSection, secondSection) ||
      isSuperset(secondSection, firstSection)
    ) {
      count++;
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (const line of input) {
    const [firstSection, secondSection] = line.split(',').map(setFromInput);
    if (intersection(firstSection, secondSection).size) {
      count++;
    }
  }

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
        2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
