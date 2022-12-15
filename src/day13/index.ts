import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('\n');
const CONTINUE = Symbol('continue');

type NestedNumbers = Array<NestedNumbers | number>;
type Pair = {
  left: NestedNumbers;
  right: NestedNumbers;
};

function comparePair(
  left: NestedNumbers,
  right: NestedNumbers,
): boolean | typeof CONTINUE {
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    let leftPacket = left[i];
    let rightPacket = right[i];
    if (Array.isArray(leftPacket) || Array.isArray(rightPacket)) {
      if (!Array.isArray(leftPacket)) {
        leftPacket = [leftPacket];
      }
      if (!Array.isArray(rightPacket)) {
        rightPacket = [rightPacket];
      }
      const result = comparePair(leftPacket, rightPacket);
      // console.log({ result });
      if (result === CONTINUE) {
        continue;
      }
      return result;
    }
    // console.log({ leftPacket, rightPacket, i });
    if (leftPacket === rightPacket) {
      continue;
    }
    if (rightPacket === undefined) {
      return false;
    }
    if (leftPacket === undefined) {
      return true;
    }
    if (leftPacket < rightPacket) {
      return true;
    }
    if (leftPacket > rightPacket) {
      return false;
    }
  }
  return CONTINUE;
}

function createPairs(input: string[]): Pair[] {
  let left: NestedNumbers | null = null;
  let right: NestedNumbers | null = null;
  const pairs: Pair[] = [];
  for (let [i, line] of input.entries()) {
    if (line === '') {
      left = null;
      right = null;
      continue;
    }
    if (!left) {
      left = JSON.parse(line);
      continue;
    }
    right = JSON.parse(line);
    if (left !== null && right !== null) {
      pairs.push({ left, right });
    }
  }
  return pairs;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  const pairs = createPairs(input);

  // console.log(pairs);
  for (let { left, right } of pairs) {
    const inOrder = comparePair(left, right);
    console.log(left, '|', right, inOrder);
    if (inOrder) {
      sum += 1;
    }
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
        [1,1,3,1,1]
        [1,1,5,1,1]

        [[1],[2,3,4]]
        [[1],4]

        [9]
        [[8,7,6]]

        [[4,4],4,4]
        [[4,4],4,4,4]

        [7,7,7,7]
        [7,7,7]

        []
        [3]

        [[[]]]
        [[]]

        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
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
