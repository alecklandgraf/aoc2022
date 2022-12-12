import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('\n');

type MonkeyId = number;

class Monkey {
  id: MonkeyId;
  startingItems: number[];
  operation: (old: number) => number;
  divisibleBy: number;
  ifTrue: MonkeyId;
  ifFalse: MonkeyId;
  inspectedCount = 0;

  constructor(
    id: number,
    startingItems: number[],
    operation: (old: number) => number,
    divisibleBy: number,
    ifTrue: MonkeyId,
    ifFalse: MonkeyId,
  ) {
    this.id = id;
    this.startingItems = startingItems;
    this.operation = operation;
    this.divisibleBy = divisibleBy;
    this.ifTrue = ifTrue;
    this.ifFalse = ifFalse;
  }

  takeTurn(veryWorried = false, modBy = 1) {
    const item = this.startingItems.pop();
    if (!item) return null;
    this.inspectedCount++;
    let newItem = this.operation(item);
    newItem = veryWorried
      ? Math.floor(newItem % modBy)
      : Math.floor(newItem / 3);
    if (newItem % this.divisibleBy === 0) {
      return {
        monkeyId: this.ifTrue,
        value: newItem,
      };
    }
    return { monkeyId: this.ifFalse, value: newItem };
  }
}

const OPERATIONS = {
  '*': (a: number, b: number) => a * b,
  '+': (a: number, b: number) => a + b,
} as const;

function parseInputMonkeys(input: string[]): Monkey[] {
  const monkeys: Monkey[] = [];
  while (input.length > 0) {
    if (input[0] === '') input.shift();
    const monkeyId = Number(input.shift()!.match(/\d+/)![0]);
    const startingItems = input
      .shift()!
      .split(' Starting items:')[1]
      .split(',')
      .map(Number);

    const operationRe = /new = old (?<op>\*|\+|\/) (?<rhs>\d+|old)/;
    const operation = input.shift()!.match(operationRe)!.groups!;
    const operationFn = (old: number) => {
      const rhs = operation.rhs === 'old' ? old : Number(operation.rhs);
      return OPERATIONS[operation.op as keyof typeof OPERATIONS](old, rhs);
    };

    const divisibleBy = Number(input.shift()!.match(/\d+/)![0]);
    const ifTrue = Number(input.shift()!.match(/\d+/)![0]);
    const ifFalse = Number(input.shift()!.match(/\d+/)![0]);
    monkeys.push(
      new Monkey(
        monkeyId,
        startingItems,
        operationFn,
        divisibleBy,
        ifTrue,
        ifFalse,
      ),
    );
  }
  return monkeys;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const monkeys = parseInputMonkeys(input);
  for (let i = 0; i < 20; i++) {
    for (let monkey of monkeys) {
      let turn = monkey.takeTurn();
      while (turn) {
        monkeys[turn.monkeyId].startingItems.push(turn.value);
        turn = monkey.takeTurn();
      }
    }
  }
  const [top, next] = _.sortBy(
    monkeys,
    (monkey) => monkey.inspectedCount,
  ).reverse();
  // console.log(top, next);
  return top.inspectedCount * next.inspectedCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const monkeys = parseInputMonkeys(input);
  const modBy = monkeys.reduce((acc, monkey) => acc * monkey.divisibleBy, 1);
  for (let i = 0; i < 10000; i++) {
    if (i === 1 || i === 20 || i === 1000)
      console.log(monkeys.map((monkey) => monkey.inspectedCount));
    for (let monkey of monkeys) {
      let turn = monkey.takeTurn(true, modBy);
      while (turn) {
        monkeys[turn.monkeyId].startingItems.push(turn.value);
        turn = monkey.takeTurn(true, modBy);
      }
    }
  }
  const [top, next] = _.sortBy(
    monkeys,
    (monkey) => monkey.inspectedCount,
  ).reverse();
  console.log(top, next);
  return top.inspectedCount * next.inspectedCount;
};

run({
  part1: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1`,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
