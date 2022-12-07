import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('\n');

type Command =
  | {
      operation: 'cd';
      path: string;
    }
  | {
      operation: 'ls';
    };

function isCommand(input: string) {
  return input.startsWith('$');
}

function parseCommand(input: string): Command {
  const [_$, operation, ...rest] = input.split(' ');
  if (operation === 'cd') {
    return {
      operation,
      path: rest.join(' '),
    };
  }
  return {
    operation: 'ls',
  };
}

//'62596 h.lst' -> 62596
type FileSizes = number[];
type FileStructure = {
  [key: string]: FileStructure | FileSizes;
  files: FileSizes;
};

function buildTree(input: string[]) {
  const tree: FileStructure = {
    files: [],
  };
  let path: string[] = [];

  for (const line of input) {
    if (isCommand(line)) {
      const command = parseCommand(line);
      if (command.operation === 'cd') {
        if (command.path === '/') {
          path = [];
        } else if (command.path === '..') {
          path.pop();
        } else {
          path.push(command.path);
        }
      }
      if (command.operation === 'ls') {
        // noop
      }
    } else {
      // add all files here to the current path in the tree and create directories
      if (line.startsWith('dir')) {
        // parse `dir ${directoryName}`
        const [_dir, dir] = line.split(' ');
        _.set(tree, [...path, dir, 'files'], []);
      } else {
        // parse `${fileSize} ${fileName}`
        const [fileSize, fileName] = line.split(' ');
        const files = _.get(tree, [...path, 'files']);
        files.push(Number(fileSize));
      }
    }
  }

  return tree;
}

let dirSizes: number[] = [];
function findDirectoriesSize(tree: FileStructure) {
  let size = _.sum(tree.files);

  for (const [key, value] of Object.entries(tree)) {
    if (key !== 'files') {
      size += findDirectoriesSize(value as FileStructure);
    }
  }
  // there's a better way to do this, like return [size, dirSizes], but this is cleaner and faster
  // maybe just use a closure
  dirSizes.push(size);
  return size;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const MAX_FILE_SIZE = 100000;
  dirSizes = [];

  const tree = buildTree(input);

  findDirectoriesSize(tree);

  return _.sum(dirSizes.filter((size) => size <= MAX_FILE_SIZE));
};

const part2 = (rawInput: string) => {
  const FILE_SYSTEM_SPACE = 70000000;
  const MIN_UPDATE_SPACE = 30000000;
  dirSizes = [];
  const input = parseInput(rawInput);

  const tree = buildTree(input);
  // console.log(JSON.stringify(tree, null, 2));

  const size = findDirectoriesSize(tree);
  const freeSpace = FILE_SYSTEM_SPACE - size;

  // console.log('total file size: ', size);
  // console.log('free space: ', freeSpace);
  // console.log(
  //   'all dir sizes: ',
  //   _.sortBy(dirSizes),
  //   _.sortBy(dirSizes).find((s) => freeSpace + s >= MIN_UPDATE_SPACE),
  // );

  return _.sortBy(dirSizes).find((s) => freeSpace + s >= MIN_UPDATE_SPACE);
};

run({
  part1: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
