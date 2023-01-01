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

function jetGasPush(
  shape: Shape,
  leftIndex: number,
  jetPattern: JetPattern,
): number {
  let newIndex = leftIndex;
  const width = Math.max(...shape.map((row) => row.length));
  if (jetPattern === LEFT) {
    newIndex--;
  }
  if (jetPattern === RIGHT) {
    newIndex++;
  }
  if (newIndex < 0) newIndex = leftIndex;
  if (newIndex + width > 6) newIndex = leftIndex;
  return newIndex;
}
const JET_PATTERN_MAP = {
  '<': LEFT,
  '>': RIGHT,
} as const;

function simulate(shape: Shape, state: State): State {
  // this is the top index but there should be three empty lines above it
  console.log('top');
  let startIndex = top(state.chamber) + 4;
  console.log('top2');
  let leftIndex = 2;
  let safety = 0;
  leftIndex = jetGasPush(
    shape,
    leftIndex,
    state.jetPattern[state.jetPatternIndex],
  );
  // console.log('can', canMoveDown(shape, state, startIndex, leftIndex));

  return state;
}

const part1 = (rawInput: string) => {
  const jetPattern = parseInput(rawInput) as JetPattern[];
  // console.log(jetPattern);
  let state: State = {
    chamber: _.fill(Array(10), ''),
    jetPattern,
    jetPatternIndex: 0,
  };
  state.chamber;

  for (let i = 0; i < 2; i++) {
    const shape = shapes[i % shapes.length];
    state = simulate(shape, state);
  }

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
