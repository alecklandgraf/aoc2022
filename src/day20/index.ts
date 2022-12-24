import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((x, i) => ({
    i,
    num: Number(x),
  }));

function mix(file: { i: number; num: number }[]) {
  const copy = [...file];
  for (const x of file) {
    const { num, i } = x;
    const iCopy = copy.indexOf(x);
    const newIndex = (iCopy + num) % (copy.length - 1);
    copy.splice(iCopy, 1);
    copy.splice(newIndex, 0, { num, i });
  }
  return copy;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const mixed = mix(input);
  const startIndex = mixed.indexOf(mixed.find((x) => x.num === 0)!);
  // console.log(startIndex, mixed);

  let sum = 0;
  for (const iter of _.range(1000, 3001, 1000)) {
    sum += mixed[(iter + startIndex) % mixed.length].num;
  }
  return sum;
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
        1
        2
        -3
        3
        -2
        0
        4`,
        expected: 3,
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
