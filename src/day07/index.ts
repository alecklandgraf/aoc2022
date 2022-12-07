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

//'62596 h.lst'
type Files = number[];
// 'dir dmd'
// type Directory = string;

type FileStructure = {
  [key: string]: FileStructure | Files;
};

function buildTree(input: string[]) {
  const tree: FileStructure = {
    files: [],
  };
  const path: string[] = [];

  for (const line of input) {
    if (isCommand(line)) {
      const command = parseCommand(line);
      if (command.operation === 'cd') {
        if (command.path === '/') {
          // clear the path
          path.length = 0;
        } else if (command.path === '..') {
          path.pop();
        } else {
          path.push(command.path);
        }
        // console.log(`changed path to /${path.join('/')}`);
      }
      if (command.operation === 'ls') {
        // noop
      }
    } else {
      // add all files here to the current path in the tree and create directories
      if (line.startsWith('dir')) {
        const [_dir, dir] = line.split(' ');
        _.set(tree, [...path, dir, 'files'], []);
      } else {
        const [fileSize, fileName] = line.split(' ');
        const files = _.get(tree, [...path, 'files']);
        files.push(Number(fileSize));
      }
    }
  }

  return tree;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const MAX_FILE_SIZE = 100000;

  const tree = buildTree(input);
  console.log(JSON.stringify(tree, null, 2));

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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
