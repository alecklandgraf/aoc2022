import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
const WIN = 6;
const DRAW = 3;

const scores = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
} as const;

const lose = {
  [ROCK]: SCISSORS,
  [PAPER]: ROCK,
  [SCISSORS]: PAPER,
} as const;

const win = {
  [ROCK]: PAPER,
  [PAPER]: SCISSORS,
  [SCISSORS]: ROCK,
} as const;

type oponentGuess = 'A' | 'B' | 'C';
type myGuess = 'X' | 'Y' | 'Z';
type inputLine = `${oponentGuess} ${myGuess}`;

function mapToScore(guess: oponentGuess | myGuess) {
  return scores[guess];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput) as inputLine[];
  let sum = 0;
  for (const line of input) {
    const values = line.split(' ') as [oponentGuess, myGuess];
    const [oponentGuess, myGuess] = values;
    const oponentPlay = mapToScore(oponentGuess);
    const myPlay = mapToScore(myGuess);

    if (oponentPlay === myPlay) {
      sum += DRAW + myPlay;
    }
    if (oponentPlay === ROCK && myPlay === SCISSORS) {
      sum += myPlay;
    }
    if (oponentPlay === SCISSORS && myPlay === PAPER) {
      sum += myPlay;
    }
    if (oponentPlay === PAPER && myPlay === ROCK) {
      sum += myPlay;
    }
    if (myPlay === ROCK && oponentPlay === SCISSORS) {
      sum += WIN + myPlay;
    }
    if (myPlay === SCISSORS && oponentPlay === PAPER) {
      sum += WIN + myPlay;
    }
    if (myPlay === PAPER && oponentPlay === ROCK) {
      sum += WIN + myPlay;
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput) as inputLine[];
  let sum = 0;
  for (const line of input) {
    const values = line.split(' ') as [oponentGuess, myGuess];
    const [oponentGuess, myGuess] = values;
    const oponentPlay = mapToScore(oponentGuess);
    // lose
    if (myGuess == 'X') {
      sum += lose[oponentPlay];
    }
    // draw
    if (myGuess == 'Y') {
      sum += DRAW + oponentPlay;
    }
    // win
    if (myGuess == 'Z') {
      sum += WIN + win[oponentPlay];
    }
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
