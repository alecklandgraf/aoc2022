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
