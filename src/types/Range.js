/**
 * Range:
 *
 * This module works with objects in the form
 * {
 *  min: Number,
 *  max: Number
 * }
 *
 */

/**
 * Automatically assigns min, max to the minumum/maximum of a, b.
 * @param {Number} a number representing one end of range
 * @param {Number} b number representing other end of range
 * @returns {Range}
 */
export const construct = (a, b) => ({
  min: Math.min(a, b),
  max: Math.max(a, b),
});

/**
 * Get the minimum of the range
 * @param {Range} range
 * @returns {Number} minimum of the range
 */
export const getMin = (range) => {
  return range.min;
};

/**
 * Get the maximum of the range
 * @param {Range} range
 * @returns {Number} maximum of the range
 */
export const getMax = (range) => {
  return range.max;
};

/**
 * Creates a range which includes both ranges.
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @returns {Range} new range expanded to fit both ranges
 */
export const union = (rangeA, rangeB) => {
  return construct(
    Math.min(getMin(rangeA), getMin(rangeB)),
    Math.max(getMax(rangeA), getMax(rangeB))
  );
};

/**
 * Return true if the ranges are equal.
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @returns {bool} true if the two ranges are equal.
 */
export const rangesAreEqual = (rangeA, rangeB) => {
  return rangeA.min === rangeB.min && rangeA.max === rangeB.max;
};
