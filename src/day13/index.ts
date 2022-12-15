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
    if (i >= left.length) {
      return true;
    }
    if (i >= right.length) {
      return false;
    }
    let leftPacket = left[i];
    let rightPacket = right[i];
    if (Number.isFinite(leftPacket) && Number.isFinite(rightPacket)) {
      if (leftPacket === rightPacket) {
        continue;
      }
      if (leftPacket < rightPacket) {
        return true;
      }
      if (leftPacket > rightPacket) {
        return false;
      }
    } else if (Array.isArray(leftPacket) && Array.isArray(rightPacket)) {
      const result = comparePair(leftPacket, rightPacket);
      if (result === CONTINUE) {
        continue;
      }
      return result;
    } else if (!Array.isArray(leftPacket)) {
      leftPacket = [leftPacket];
      const result = comparePair(leftPacket, rightPacket as NestedNumbers);
      if (result === CONTINUE) {
        continue;
      }
      return result;
    } else if (!Array.isArray(rightPacket)) {
      rightPacket = [rightPacket];
      const result = comparePair(leftPacket, rightPacket);
      if (result === CONTINUE) {
        continue;
      }
      return result;
    }

    // console.log({ leftPacket, rightPacket, i });
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
  for (let i = 0; i < pairs.length; i++) {
    const { left, right } = pairs[i];
    const inOrder = comparePair(left, right);
    // console.log(i, left, '|', right, inOrder);
    if (inOrder) {
      sum += i + 1;
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
  // onlyTests: true,
});
