const l = console.log.bind(console);

/**
 * Produces the next char based on the numeric input string.
 *
 * ASSUME: The input is a valid numeric value.
 *
 * @param {string} value The numeric string.
 * @return {string} The computed character.
 *
 * @sig String -> String
 *
 * @example
 * nextCharFromNumStr('64');
 * // → 'A'
 *
 * @example
 * nextCharFromNumStr(' 64  ');
 * // → 'A'
 */
const nextCharFromNumStr = value => {
  return String.fromCharCode(parseInt(value.trim(), 10) + 1);
};

//
// CONS:
// • Nesting of invokations is hard to read, easy to get lost.
// • Not scalable. Hard to add new stuff in anywhere in the chain.
//

l(nextCharFromNumStr('64'));
l(nextCharFromNumStr('96'));
// → A
// → a

//
// vim: set tw=72:
//
