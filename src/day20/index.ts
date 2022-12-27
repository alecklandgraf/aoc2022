import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((x, i) => ({
    i,
    num: Number(x),
  }));

function mix(file: { i: number; num: number }[], count = 1) {
  const copy = [...file];
  for (const _time of _.range(count)) {
    for (const entry of file) {
      const { num } = entry;
      const iCopy = copy.indexOf(entry);

      const newIndex = (iCopy + num) % (copy.length - 1);

      copy.splice(iCopy, 1);
      copy.splice(newIndex, 0, entry);
    }
    // console.log(_time, copy);
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
  const decryptionKey = 811589153;
  const input = parseInput(rawInput).map((x) => ({
    ...x,
    num: x.num * decryptionKey,
  }));
  const mixed = mix(input, 10);
  // console.log(mixed);

  const startIndex = mixed.indexOf(mixed.find((x) => x.num === 0)!);
  // console.log(startIndex, mixed);

  let sum = 0;
  for (const iter of _.range(1000, 3001, 1000)) {
    // console.log(mixed[(iter + startIndex) % mixed.length].num);
    sum += mixed[(iter + startIndex) % mixed.length].num;
  }
  return sum;
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
      {
        input: `
        1
        2
        -3
        3
        -2
        0
        4`,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
