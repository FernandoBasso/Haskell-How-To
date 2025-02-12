/**
 * Add `x` and `y` together.
 *
 * - T.C: O(1).
 * - S.C: O(1).
 *
 * @sig Number Number -> Number
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function add(x, y) {
  return x + y;
}

/**
 * Sort callback for ascending order.
 *
 * - T.C: O(1).
 * - S.C: O(1).
 *
 * @sig Int Int -> Int
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function sortAsc(x, y) {
  return x - y;
}

/**
 * Finds the min and max sum of the five-integer array.
 *
 * ASSUME: The input always contains five positive integers and is
 * sorted in ascending order.
 *
 * - T.C: O(n).
 * - S.C: O(n).
 *
 * @sig [Int] -> { min: Int, max: Int }
 * @param {number} xs
 * @returns {{ min: number, max: number }}
 */
function miniMaxSum(xs) {
  var sorted = [...xs].sort(sortAsc);

  return {
    min: sorted.slice(0, 4).reduce(add, 0),
    max: sorted.slice(1).reduce(add, 0),
  };
}

export { miniMaxSum };
