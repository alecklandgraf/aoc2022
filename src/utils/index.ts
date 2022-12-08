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
