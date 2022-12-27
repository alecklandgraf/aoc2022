import run from 'aocrunner';

type Valve = {
  name: string;
  flowRate: number;
  tunnels: Valve[];
};

const parseInput = (rawInput: string) => rawInput.split('\n');

// this is used like a set, but it's faster to check if a bit is set
// AA -> 1, BB -> 2, CC -> 4, etc
// then you can add and subtract them to get the open valves
// and check via bitwise AND if a valve is open
const valveBitMap: Map<string, number> = new Map();

function createTunnelNetwork(input: string[]) {
  const valvesMap: Map<string, Valve> = new Map();
  const reValve =
    /Valve (?<valve>[A-Z]{2}) has flow rate=(?<rate>\d+); tunnel[s]? lead[s]? to valve[s]? (?<valves>.*)/;
  // create the nodes
  for (let line of input) {
    const groups = line.match(reValve)?.groups;
    if (!groups) {
      throw new Error(`Invalid input: ${line}`);
    }
    const { valve, rate } = groups;
    valvesMap.set(valve, {
      name: valve,
      flowRate: Number(rate),
      tunnels: [],
    });
    valveBitMap.set(valve, 1 << valveBitMap.size);
  }
  // create the edges
  for (let line of input) {
    const groups = line.match(reValve)?.groups;
    if (!groups) {
      throw new Error(`Invalid input: ${line}`);
    }
    const { valve, valves } = groups;
    const valveNode = valvesMap.get(valve);
    if (!valveNode) {
      throw new Error(`Invalid input: ${line}`);
    }
    for (let tunnel of valves.split(', ')) {
      const tunnelNode = valvesMap.get(tunnel);
      if (!tunnelNode) {
        throw new Error(`Invalid input: ${line}`);
      }
      valveNode.tunnels.push(tunnelNode);
    }
  }
  return valvesMap;
}

let valvesMap: Map<string, Valve> = new Map();

const memo = new Map<string, number>();
const memokey = (
  start: string,
  openValves: string,
  timeRemaining: number,
  twoPlayers: boolean,
) => `${start}|${openValves}|${timeRemaining}|${twoPlayers}`;

// instead of AA -> II -> JJ, it could be AA -> JJ with a weight of 2
function getPressureUsed(
  start: Valve['name'],
  openValves: string,
  timeRemaining: number,
  twoPlayers: boolean = false,
): number {
  // if there are two players, the first player can go, then we can reset the clock and the second player can go
  // using the same set of open valves
  if (timeRemaining <= 1) {
    return twoPlayers ? getPressureUsed('AA', openValves, 26, false) : 0;
  }
  // memo check needs to come after the timeRemaining check
  if (memo.has(memokey(start, openValves, timeRemaining, twoPlayers))) {
    return memo.get(memokey(start, openValves, timeRemaining, twoPlayers))!;
  }

  const startValve = valvesMap.get(start)!;
  let maxPressureUsed = 0;

  // skip opening the current valve if it's open or it's rate is 0
  // otherwise check the max of 1. opening it and 2. not opening it
  if (startValve.flowRate > 0 && !openValves.includes(start)) {
    // hacky string concat, but faster than serializing and deserializing a Set
    const opens = `${openValves},${start}`.split(',').sort().join(',');
    const pressureUsed = getPressureUsed(
      start,
      opens,
      timeRemaining - 1,
      twoPlayers,
    );
    // this is the max pressure used if we open the valve
    maxPressureUsed = pressureUsed + startValve.flowRate * (timeRemaining - 1);
  }
  if (timeRemaining <= 2) {
    return maxPressureUsed;
  }
  // check the max pressure used if we don't open the valve
  for (let tunnel of startValve.tunnels) {
    const pressureUsed = getPressureUsed(
      tunnel.name,
      openValves,
      timeRemaining - 1,
      twoPlayers,
    );
    if (pressureUsed > maxPressureUsed) {
      maxPressureUsed = pressureUsed;
    }
  }

  memo.set(
    memokey(start, openValves, timeRemaining, twoPlayers),
    maxPressureUsed,
  );

  return maxPressureUsed;
}

function floydWarshall(valvesMap: Map<string, Valve>) {
  const distances = new Map<string, number>();
  for (let i of valvesMap.keys()) {
    for (let j of valvesMap.keys()) {
      distances.set(i + j, Infinity);
      if (i === j) {
        distances.set(i + j, 0);
      }
      if (valvesMap.get(i)!.tunnels.includes(valvesMap.get(j)!)) {
        distances.set(i + j, 1);
      }
    }
  }

  for (let k of valvesMap.keys()) {
    for (let i of valvesMap.keys()) {
      for (let j of valvesMap.keys()) {
        const newDistance = distances.get(i + k)! + distances.get(k + j)!;
        if (newDistance < distances.get(i + j)!) {
          distances.set(i + j, newDistance);
        }
      }
    }
  }

  return distances;
}

function getPath(
  distances: Map<string, number>,
  valveMap: Map<string, Valve>,
  remainingValves: number,
  timeRemaining: number,
  start: string,
  path: { [valveName: string]: number } = {},
) {
  let paths = [path];
  if (timeRemaining < 2) return paths;
  // timeRemaining === 4 &&
  //   console.log({
  //     remainingValves: [...valveBitMap.keys()].filter(
  //       (valveName) => valveBitMap.get(valveName)! & remainingValves,
  //     ),
  //     paths,
  //   });
  for (let valveName of [...valveBitMap.keys()].filter(
    (valveName) => valveBitMap.get(valveName)! & remainingValves,
  )) {
    const distance = distances.get(start + valveName)!;
    // if (timeRemaining == 28) console.log({ distance, next: start + valveName });
    const time = timeRemaining - distance - 1;

    const newPath = { ...path, [valveName]: time };
    // timeRemaining === 4 && console.log({ newPath });
    const solutionPath = getPath(
      distances,
      valveMap,
      remainingValves - valveBitMap.get(valveName)!,
      time,
      valveName,
      newPath,
    );
    paths = [...paths, ...solutionPath];
    // console.log({ paths });
  }

  return paths;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);

  // reset the memoization between runs
  memo.clear();
  valvesMap.clear();
  valveBitMap.clear();

  valvesMap = createTunnelNetwork(input);

  const pressureUsed = getPressureUsed('AA', '', 30);
  console.log({ pressureUsed });

  return pressureUsed;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  memo.clear();
  valvesMap.clear();
  valveBitMap.clear();

  valvesMap = createTunnelNetwork(input);
  const distances = floydWarshall(valvesMap);
  // console.log(distances);
  // console.log({ valveBitMap });
  const remainingValves = [...valveBitMap.entries()]
    .filter(([key]) => valvesMap.get(key)?.flowRate)
    .map(([key, val]) => val)
    .reduce((a, b) => a | b, 0);
  // console.log({ remainingValves });
  // const pressureUsed = getPressureUsed('AA', '', 26, true);
  const paths = getPath(distances, valvesMap, remainingValves, 30, 'AA');
  // console.log(paths);
  const mostPressureUsed = Math.max(
    ...paths.map((path) => {
      return Object.entries(path).reduce((a, [valveName, time]) => {
        return a + valvesMap.get(valveName)!.flowRate * time;
      }, 0);
    }),
  );

  return mostPressureUsed;
};

run({
  part1: {
    tests: [
      {
        input: `
        Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        Valve BB has flow rate=13; tunnels lead to valves CC, AA
        Valve CC has flow rate=2; tunnels lead to valves DD, BB
        Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
        Valve EE has flow rate=3; tunnels lead to valves FF, DD
        Valve FF has flow rate=0; tunnels lead to valves EE, GG
        Valve GG has flow rate=0; tunnels lead to valves FF, HH
        Valve HH has flow rate=22; tunnel leads to valve GG
        Valve II has flow rate=0; tunnels lead to valves AA, JJ
        Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        Valve BB has flow rate=13; tunnels lead to valves CC, AA
        Valve CC has flow rate=2; tunnels lead to valves DD, BB
        Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
        Valve EE has flow rate=3; tunnels lead to valves FF, DD
        Valve FF has flow rate=0; tunnels lead to valves EE, GG
        Valve GG has flow rate=0; tunnels lead to valves FF, HH
        Valve HH has flow rate=22; tunnel leads to valve GG
        Valve II has flow rate=0; tunnels lead to valves AA, JJ
        Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
