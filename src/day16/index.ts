import run from 'aocrunner';
import { PriorityQueue } from '@datastructures-js/priority-queue';

type Valve = {
  name: string;
  flowRate: number;
  tunnels: Valve[];
  /** heuristic rate * distance */
  h: number;
  /** h + g */
  f: number;
  /** steps from start */
  g: number;
  parent: Valve | null;
};

// max prioity queue
function compareNodes(a: Valve, b: Valve) {
  if (a.f === b.f) {
    return b.h - a.h;
  }
  return b.f - a.f;
}

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
      h: 0,
      f: 0,
      g: 0,
      parent: null,
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

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const valvesMap = createTunnelNetwork(input);
  // console.log(valvesMap, valvesMap.get('AA'));

  // make one manual loop to see if we can find the first best node, should be AA -> DD
  const start = valvesMap.get('AA')!;
  let open = new PriorityQueue<Valve>(compareNodes);
  const closed = new Set<Valve>();
  const visited = new Set<Valve>();

  start.g = 0;
  open.enqueue(start);
  let lastNode: Valve | null = null;
  while (open.size()) {
    const current = open.dequeue();
    closed.add(current);
    // normally here we'd check for the goal/end node
    if (closed.size === valvesMap.size) {
      console.log('found all nodes');
      lastNode = current;
      break;
    }
    // check all the neighbours
    for (let tunnel of current.tunnels) {
      if (closed.has(tunnel)) {
        continue;
      }
      // calculate the heuristic
      const h = tunnel.flowRate;
      // calculate the g
      const g = current.g + 1;
      // calculate the f
      const f = h * g;
      // check if we've visited this node before
      const beenVisited = visited.has(tunnel);
      if (!beenVisited || g < tunnel.g) {
        // if it's a better path, update the node
        tunnel.g = g;
        tunnel.h = h;
        tunnel.f = f;
        tunnel.parent = current;
        visited.add(tunnel);
        if (!beenVisited) {
          open.enqueue(tunnel);
        } else {
          // heapify
          open = PriorityQueue.fromArray<Valve>(open.toArray(), compareNodes);
        }
      }
    }
  }
  // console.log(closed);

  console.log('HH', valvesMap.get('HH'));

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
