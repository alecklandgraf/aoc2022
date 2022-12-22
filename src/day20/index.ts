import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map(Number);

class LinkedList {
  constructor(
    public value: number,
    public index: number,
    public next: LinkedList | null = null,
    public previous: LinkedList | null = null,
  ) {}
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  console.log(input);
  let ll = new LinkedList(input[0], 0);
  const head = ll;
  for (let i = 1; i < input.length; i++) {
    const node = new LinkedList(input[i], i);
    ll.next = node;
    node.previous = ll;
    ll = node;
  }
  ll.next = head;
  head.previous = ll;
  ll = head;
  console.log(ll);

  return;
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
  onlyTests: true,
});
