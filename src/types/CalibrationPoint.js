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


export const getXPosition = (cp) => cp.x;
export const getWavelength = (cp) => cp.w;
export const getCartesian = (cp) => ({ x: cp.x, y: cp.w });
