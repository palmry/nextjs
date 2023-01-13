/**
 * Perform a unicode-safe slice on a string.
 * Will not slice UTF-16 surrogate pairs in two.
 *
 * @param {string} str the string to slice
 * @param {number} start the character index to begin slicing
 * @param {number} end the character index to stop slicing
 */
export const unicodeSlice = (str, start, end) => {
  return [...str].slice(start, end).join('')
}
