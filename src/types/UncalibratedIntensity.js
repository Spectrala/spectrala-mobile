/**
 * UncalibratedIntensity:
 *
 * This module works with objects in the form
 * {
 *  x: Number,
 *  i: Number
 * }
 *
 * These represent points along an uncalibrated intensity graph.
 */

/**
 * Constructs a calibration preset
 * @param {Number} xPosition horizontal location [0-1] along the x-axis
 * @param {Number} intensity intensity for the given xPosition
 * @returns {UncalibratedIntensity}
 */
export const construct = (xPosition, intensity) => ({
  x: xPosition,
  i: intensity,
});

/**
 * Return the x position of the uncalibrated intensity point.
 * @param {UncalibratedIntensity} uncalibratedIntensity
 * @returns {Number}
 */
export const getXPosition = (uncalibratedIntensity) => uncalibratedIntensity.x;

/**
 * Return the intensity of the uncalibrated intensity point.
 * @param {UncalibratedIntensity} uncalibratedIntensity
 * @returns {Number}
 */
export const getIntensity = (uncalibratedIntensity) => uncalibratedIntensity.i;
