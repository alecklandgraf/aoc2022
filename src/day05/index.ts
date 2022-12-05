import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

/**
 * Makes something like
 * [
  [ '    [D]    ', '[N] [C]    ', '[Z] [M] [P]' ],
  ' 1   2   3 ',
  [
    'move 1 from 2 to 1',
    'move 3 from 1 to 3',
    'move 2 from 2 to 1',
    'move 1 from 1 to 2'
  ]
]
 */
function splitInput(input: string[]): [string[], string, string[]] {
  const index = input.indexOf('');
  // the array ['1', '2', '3', ...] isn't needed
  return [input.slice(0, index - 1), input[index - 1], input.slice(index + 1)];
}

type Stacks = {
  [key: string]: string[];
};

/**
 * Makes something like { '1': [ 'N', 'Z' ], '2': [ 'D', 'C', 'M' ], '3': [ 'P' ] }
 */
function buildStacks(stacksInput: string[], columns: string) {
  const stacks: Stacks = {};

  for (let i = 0; i < columns.length; i++) {
    if (columns[i] !== ' ') {
      for (const stack of stacksInput) {
        if (stack[i] !== ' ') {
          if (!stacks[columns[i]]) {
            stacks[columns[i]] = [];
          }
          stacks[columns[i]].push(stack[i]);
        }
      }
    }
  }
  return stacks;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [stacksInput, columns, procedures] = splitInput(input);
  const stacks = buildStacks(stacksInput, columns);
  for (const procedure of procedures) {
    const [_move, qty, _form, from, _to, to] = procedure.split(' ');
    const fromStack = stacks[from];
    const toStack = stacks[to];
    for (let i = 0; i < Number(qty); i++) {
      toStack.unshift(fromStack.shift() as string);
    }
  }

  return Object.values(stacks)
    .map((stack) => stack[0] || '')
    .join('');
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'CMZ',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'MCD',
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: true,
});
