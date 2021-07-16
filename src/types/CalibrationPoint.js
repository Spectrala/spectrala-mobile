/**
 * CalibPt:
 *
 * This module works with objects in the form
 * {
 *  x: Number,
 *  w: Number
 * }
 *
 * These represent the ticks on the graph during calibration.
 */

/**
 * Constructs a calibration point
 * @param {number} xPosition location, [0,1] along the chart
 * @param {number} wavelength wavelength to be associated with xPosition
 * @returns {CalibPt}
 */
export const construct = (xPosition, wavelength) => ({
  x: xPosition,
  w: wavelength,
});

/**
 * Return the x position of a calibration point
 * @param {CalibPt} calibrationPoint
 * @returns {number} the x position of the point
 */
export const getXPosition = (calibrationPoint) => calibrationPoint.x;

/**
 * Set the x position of a calibration point to a new value.
 * Mutates the object.
 * @param {CalibPt} calibrationPoint
 * @param {number} xPosition the x position of the point
 */
export const setXPosition = (calibrationPoint, xPosition) => {
  calibrationPoint.x = xPosition;
};

/**
 * Return the wavelength of a calibration point
 * @param {CalibPt} calibrationPoint
 * @returns {number} the wavelength of the point
 */
export const getWavelength = (calibrationPoint) => calibrationPoint.w;
