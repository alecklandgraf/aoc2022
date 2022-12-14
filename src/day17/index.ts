import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('');

const LEFT = '<' as const;
const RIGHT = '>' as const;
type JetPattern = typeof LEFT | typeof RIGHT;

const shape1 = ['####'] as const;
const shape2 = [` # `, '###', ` # `] as const;
const shape3 = [`  #`, '  #', '###'] as const;
const shape4 = ['#', '#', '#', '#'] as const;
const shape5 = ['##', '##'] as const;
const shapes: Shape[] = [shape1, shape2, shape3, shape4, shape5];
type Shape =
  | typeof shape1
  | typeof shape2
  | typeof shape3
  | typeof shape4
  | typeof shape5;
/**

The first rock begins falling:
|..@@@@.|
|.......|
|.......|
|.......|
+-------+

*/

/**
 * returns the top index of the state or the bottom
 */
function top(chamber: string[]): number {
  for (let i = chamber.length - 1; i >= 0; i--) {
    if (chamber[i].includes('#')) return i;
  }
  // found the floor
  return 0;
}

type State = {
  chamber: string[];
  jetPattern: JetPattern[];
  jetPatternIndex: number;
};

/**
 *
 * @param shape
 * @param state
 * @param height this is the index where the piece currently is, need to check one down
 * @param left
 * @returns boolean
 */
function canMoveDown(
  shape: Shape,
  state: State,
  height: number,
  left: number,
): boolean {
  if (height === 0) return false;
  // N.B. shape 2 needs special handling
  const bottomOfShape = shape[shape.length - 1];
  // the width of the chamber is 7
  for (let i = 0; i < 7; i++) {
    if (bottomOfShape[i - left] === '#') {
      if (state.chamber[height - 1][i] === '#') return false;
    }
  }
  if (shape === shape2) {
    const middleOfShape = shape2[1];
    for (let i = 0; i < 7; i++) {
      if (middleOfShape[i - left] === '#') {
        if (state.chamber[height - 1][i] === '#') return false;
      }
    }
  }
  return true;
}
function canMove(
  shape: Shape,
  state: State,
  height: number,
  left: number,
  direction: JetPattern,
): boolean {
  return true;
}
const canMoveLeft = (
  shape: Shape,
  state: State,
  height: number,
  left: number,
) => canMove(shape, state, height, left, LEFT);
const canMoveRight = (
  shape: Shape,
  state: State,
  height: number,
  left: number,
) => canMove(shape, state, height, left, RIGHT);

function jetGasPush(
  shape: Shape,
  state: State,
  height: number,
  leftIndex: number,
): number {
  const jetPattern = state.jetPattern[state.jetPatternIndex];
  let newIndex = leftIndex;
  const width = Math.max(...shape.map((row) => row.length));

  // console.log({ width, leftIndex, jetPattern });
  if (jetPattern === LEFT && canMoveLeft(shape, state, height, leftIndex)) {
    newIndex--;
  }
  if (jetPattern === RIGHT && canMoveRight(shape, state, height, leftIndex)) {
    newIndex++;
  }
  if (newIndex < 0) newIndex = leftIndex;
  if (newIndex + width > 7) newIndex = leftIndex;
  return newIndex;
}

function simulate(shape: Shape, state: State): State {
  // this is the top index but there should be three empty lines above it
  let startIndex = top(state.chamber) + 4;
  let leftIndex = 2;
  let safety = 0;
  leftIndex = jetGasPush(shape, state, startIndex, leftIndex);
  console.log('start', {
    startIndex,
    leftIndex,
    jetPattern: state.jetPattern[state.jetPatternIndex],
  });
  while (canMoveDown(shape, state, startIndex, leftIndex) && safety++ < 100) {
    startIndex--;
    state.jetPatternIndex =
      (state.jetPatternIndex + 1) % state.jetPattern.length;
    console.log({ startIndex, leftIndex, jetPattern: state.jetPatternIndex });
    leftIndex = jetGasPush(shape, state, startIndex, leftIndex);
  }
  console.log({ startIndex, leftIndex, shape });

  return state;
}

const part1 = (rawInput: string) => {
  const jetPattern = parseInput(rawInput) as JetPattern[];

  let state: State = {
    chamber: _.fill(Array(10), ''),
    jetPattern,
    jetPatternIndex: 0,
  };

  for (let i = 0; i < 1; i++) {
    const shape = shapes[i % shapes.length];
    state = simulate(shape, state);
  }
  // console.log(jetGasPush(shape1, 2, '>'));

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
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
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
