import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  for (const line of input) {
    const half = Math.ceil(line.length / 2);

    const firstHalf = line.slice(0, half);
    const secondHalf = line.slice(half);
    const letter = _.intersection(firstHalf.split(''), secondHalf.split(''))[0];
    const charCodeAt = letter.charCodeAt(0);

    sum += charCodeAt <= 90 ? charCodeAt - 38 : charCodeAt - 96;
  }

  return sum;
};

function priority(letter: string) {
  try {
    const charCodeAt = letter.charCodeAt(0);
    return charCodeAt <= 90 ? charCodeAt - 38 : charCodeAt - 96;
  } catch (e) {
    throw new Error(`letter ${letter} is not a letter`);
  }
}

const part2 = (rawInput: string) => {
  const input = _.chunk(parseInput(rawInput), 3);
  const letters = input.map((group) =>
    _.intersection(...group.map((line) => line.split(''))),
  );

  return _.sumBy(letters, (letter) => priority(letter[0]));
};

run({
  part1: {
    tests: [
      {
        input: `
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
