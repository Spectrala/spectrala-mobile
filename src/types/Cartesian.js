import * as CalibPt from "./CalibrationPoint";
/**
 * Cartesian:
 *
 * This module works with objects in the form
 * {
 *  x: Number,
 *  y: Number
 * }
 * And provides functionality for treating them as
 * cartesian points on a graph.
 */

/**
 * Constructs a Cartesian using a CalibPt.
 * Maps the xPosition of the calibration point to x,
 * and the wavelength of the calibration point to y.
 * @param {CalibPt} calibrationPoint
 * @returns
 */
export const fromCalibPt = (calibrationPoint) => ({
  x: calibrationPoint.x,
  y: calibrationPoint.w,
});

/**
 * Return the x value of the cartesian point
 * @param {Cartesian} point
 * @returns {number} the x value of the cartesian point
 */
export const getX = (point) => point.x;

/**
 * Return the y value of the cartesian point
 * @param {Cartesian} point
 * @returns {number} the y value of the cartesian point
 */
export const getY = (point) => point.y;

/**
 *
 * @param {Cartesian} a lower x point
 * @param {Cartesian} b higher x point
 * @returns {function} point slope equation using a,b.
 */
export const getPointSlopeEquation = (a, b) => {
  const m = (b.y - a.y) / (b.x - a.x);
  const equation = (x) => m * (x - a.x) + a.y;
  return equation;
};

/**
 * Applies linear interpolation to get the y for a particular x given
 * a list of data points.
 * @param {Array<Cartesian>} dataPoints trend to
 * @param {number} x
 * @returns {number} interpolated y value
 */
export const interpolateYFromData = (dataPoints, x) => {
  for (let i = 0; i < dataPoints.length - 1; i++) {
    const a = dataPoints[i];
    const b = dataPoints[i + 1];
    if (a.x <= x && x <= b.x) {
      return getPointSlopeEquation(a, b)(x);
    }
  }
  return null;
};
