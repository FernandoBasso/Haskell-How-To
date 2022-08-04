const log = console.log.bind(console);

/**
 * Divide an integer `num` into `parts` even parts (or as
 * even as they can be).
 *
 * ASSUME: `num` can always be evenly divided.
 *
 * @example
 * spitInt(10, 1);
 * // → [10]
 *
 * @example
 * split(10, 3);
 * // → [3, 3, 4]
 *
 * @example
 * split(20, 6);
 * // → [3, 3, 3, 3, 4, 4]
 *
 * @param num The integer number to split.
 * @param parts The number of parts to split `num` into.
 * @returns
 */
function splitInt(num, parts) {
  var rem = num % parts;
  var div = Math.floor(num / parts);

  // splitInt(20, 6)
  // 3 * 4 = 12
  // 20 - 12 = 8
  // 8 / rem = 4
  var divExtra = (num - (parts - rem) * div) / rem;

  return new Array(parts).fill(div).fill(divExtra, parts - rem);
}

log(splitInt(10, 1));
log(splitInt(2, 2));

log(splitInt(10, 2));
log(splitInt(10, 3));
log(splitInt(20, 6));

log(splitInt(47, 15));
