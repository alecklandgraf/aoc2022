/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

import { PriorityQueue } from '@datastructures-js/priority-queue';

// set functions
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

export function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

export function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

export function difference<T>(setA: Set<T>, setB: Set<T>) {
  const _difference = new Set<T>(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export function union<T>(setA: Set<T>, setB: Set<T>) {
  const _union = new Set<T>(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

/*

const graph = {
	start: { A: 5, B: 2 },
	A: { C: 4, D: 2 },
	B: { A: 8, D: 7 },
	C: { D: 6, finish: 3 },
	D: { finish: 1 },
	finish: {},
};
*/

function shortestDistanceNode(
  distances: { [key: string]: number },
  visited: Set<string>,
) {
  // create a default value for shortest
  let shortest = null;

  // for each node in the distances object
  for (let node in distances) {
    // if no node has been assigned to shortest yet
    // or if the current node's distance is smaller than the current shortest
    let currentIsShortest =
      shortest === null || distances[node] < distances[shortest];

    // and if the current node is in the unvisited set
    if (currentIsShortest && !visited.has(node)) {
      // update shortest to be the current node
      shortest = node;
    }
  }
  return shortest;
}

export type Graph = {
  [key: string]: { [key: string]: number } | null;
};

// license MIT https://github.com/noamsauerutley/shortest-path
export function findShortestPathWithLogs(
  graph: Graph,
  startNode: string,
  endNode: string,
) {
  // establish object for recording distances from the start node
  const distances: { [key: string]: number } = {};
  distances[endNode] = Infinity;
  Object.assign(distances, graph[startNode]);
  // distances = { A: 5, B: 2, finish: Infinity };

  // track paths
  const parents: { [key: string]: string } = {};
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }
  // parents = { A: "start", B: "start", endNode: null };

  // track nodes that have already been visited
  const visited = new Set<string>();

  // find the nearest node
  let node = shortestDistanceNode(distances, visited);
  // in the first iteration, the nearest node is "B"

  // node = B = { A: 8, D: 7 }
  // visited = {}
  // distances = { A: 5, B: 2, finish: Infinity }
  // parents = { A: "start", B: "start", endNode: null }

  // for that node
  while (node) {
    // find its distance from the start node & its child nodes
    let distance = distances[node]; // 2
    let children = graph[node]; // { A: 8, D: 7}

    for (let child in children) {
      // make sure each child node is not the start node
      if (String(child) === String(startNode)) {
        // console.log("don't return to the start node! 🙅");
        continue;
      }
      // console.log('startNode: ' + startNode);
      // console.log('distance from node ' + parents[node] + ' to node ' + node);
      // console.log('previous distance: ' + distances[node]);
      // save the distance from the start node to the child node
      const newdistance = distance + children[child];
      // console.log('new distance: ' + newdistance);
      // if there's no recorded distance from the start node to the child node in the distances object
      // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
      // save the distance to the object
      // record the path
      if (!distances[child] || distances[child] > newdistance) {
        distances[child] = newdistance;
        parents[child] = node;
        // console.log(`distance + parents updated to ${child}`);
      } else {
        // console.log(
        //   `not updating, because a shorter path to ${child} to already exists!`,
        // );
      }
    }
    console.log(JSON.stringify({ distances }));
    console.log(JSON.stringify({ parents }));
    console.log(JSON.stringify({ visited: [...visited] }));
    // move the node to the visited set
    visited.add(node);
    // move to the nearest neighbor node
    node = shortestDistanceNode(distances, visited);
  }

  // using the stored paths from start node to end node
  // record the shortest path
  const shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  // return the shortest path from start node to end node & its distance
  const results = {
    distance: distances[endNode],
    path: shortestPath,
  };

  return results;
}

export function getNumberFromString(str: string) {
  return Number(str.replace(/\D/g, ''));
}

export function getNumbersFromString(str: string) {
  return str.match(/\d+/g)?.map(Number) || [];
}

interface Point {
  x: number;
  y: number;
}

// this is the heuristic function, more at http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
export function manhattanDistance(a: Point, b: Point, minCost = 1) {
  return minCost * (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
}

export function neighbors4(point: Point): number[][];
export function neighbors4(point: Node, grid: Node[][]): Node[];
export function neighbors4({ x, y }: Point | Node, grid?: Node[][]) {
  if (grid) {
    return [
      // West
      grid[y]?.[x - 1],
      // East
      grid[y]?.[x + 1],
      // South
      grid[y - 1]?.[x],
      // North
      grid[y + 1]?.[x],
    ].filter(Boolean);
  }
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
}

export interface Node extends Point {
  /** F-cost: G-cost + H-cost */
  f: number;
  /** G-cost: distance from start */
  g: number;
  /** H-cost: distance to end (heuristic) */
  h: number;
  /** cost: used to mark walls or weight the traversability of move */
  cost: number;
  /** Parent node */
  parent: Node | null;
  /** visited */
  visited?: boolean;
  /** closed */
  closed?: boolean;
  /** Add any debug data here for logging */
  debug?: any;
}

interface PrintNodeOptions {
  includeCosts?: boolean;
  indent?: number;
}
function printNode(
  node: Node,
  { includeCosts = true, indent = 0 }: PrintNodeOptions = {},
) {
  const out = `<${node.debug} - (${node.x}, ${node.y})${
    includeCosts ? ` [${node.f} = ${node.g} + ${node.h}]` : ''
  }, Parent: ${
    node.parent
      ? `${node.parent.debug}(${node.parent.x},${node.parent.y})`
      : '?'
  }>`;
  return out.padStart(out.length + indent);
}

function compareNodes(a: Node, b: Node) {
  if (a.f === b.f) {
    return a.h - b.h;
  }
  return a.f - b.f;
}

export function aStar(
  grid: Node[][],
  start: Node,
  end: Node,
  heuristic = manhattanDistance,
) {
  let open = new PriorityQueue<Node>(compareNodes);
  start.h = heuristic(start, end);
  start.f = start.g + start.h;
  open.enqueue(start);
  let step = 0;
  while (open.size()) {
    const current = open.dequeue()!;
    if (current === end) {
      // should be able to get path from curren.parent.parent...
      let path = [current];
      let pathCurrent = current;
      while (pathCurrent.parent) {
        pathCurrent = pathCurrent.parent;
        path.push(pathCurrent);
      }
      return path;
    }
    current.closed = true;
    const neighbors = neighbors4(current, grid);
    let log = false;
    // if (step < 4 || (current.x === 2 && current.y === 3)) {
    //   log = true;
    // }

    step++;
    log &&
      console.log(
        'step:',
        step,
        'current:',
        printNode(current),
        'neighbors: \n',
        neighbors
          .map((n, i) =>
            printNode(n, { includeCosts: false, indent: i === 0 ? 3 : 4 }),
          )
          .join('\n'),
      );
    for (const neighbor of neighbors) {
      // if (log) {
      //   console.log(
      //     'neighbor',
      //     neighbor.cost,
      //     'current',
      //     current.cost,
      //     'close',
      //     neighbor.closed || false,
      //     'test',
      //     current.cost <= neighbor.cost && neighbor.cost - current.cost > 1,
      //   );
      // }
      // if neighbor is not traverable or neighbor is closed, skip
      if (
        neighbor.closed ||
        (current.cost <= neighbor.cost && neighbor.cost - current.cost > 1) // this condition to be a function, isWall(neighbor, current)
      ) {
        continue;
      }
      // if new path to neighbor is shorter or neighbor has not been visited yet
      // normaly you would add the cost of the neighbor to the current.g, but here we are using
      // the cost to mark walls and weight the traversability of move which is checked above.
      // TLDR: all valid moves have a cost of 1
      const gScore = current.g + 1;
      const beenVisited = neighbor.visited;
      if (log) {
        console.log(
          'checks',
          printNode(neighbor, { includeCosts: false }),
          'gScore',
          gScore,
          beenVisited,
        );
      }
      if (!beenVisited || gScore < neighbor.g) {
        neighbor.g = gScore;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        neighbor.visited = true;
        if (!beenVisited) {
          open.enqueue(neighbor);
        } else {
          // time to reheapify since we just updated neighbor.f
          open = PriorityQueue.fromArray<Node>(open.toArray(), compareNodes);
        }
        log && console.log('neighbor:', printNode(neighbor));
      }
    }
  }
  return [] as Node[];
}
