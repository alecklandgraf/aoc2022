import run from 'aocrunner';

type Valve = {
  name: string;
  flowRate: number;
  tunnels: Valve[];
};

const parseInput = (rawInput: string) => rawInput.split('\n');

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

// const memo = new Map<string, number>();
let memo: { [key: string]: number } = {};
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
  if (timeRemaining <= 0) {
    return twoPlayers ? getPressureUsed('AA', openValves, 26, false) : 0;
  }
  // memo check needs to come after the timeRemaining check
  if (memo[memokey(start, openValves, timeRemaining, twoPlayers)]) {
    return memo[memokey(start, openValves, timeRemaining, twoPlayers)];
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

  memo[memokey(start, openValves, timeRemaining, twoPlayers)] = maxPressureUsed;

  return maxPressureUsed;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);

  // reset the memoization between runs
  memo = {};
  valvesMap.clear();

  valvesMap = createTunnelNetwork(input);

  const pressureUsed = getPressureUsed('AA', '', 30);
  console.log({ pressureUsed });

  return pressureUsed;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  memo = {};
  valvesMap.clear();

  valvesMap = createTunnelNetwork(input);
  const pressureUsed = getPressureUsed('AA', '', 26, true);
  // console.log(memo.size);

  return pressureUsed;
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
  // onlyTests: true,
});
