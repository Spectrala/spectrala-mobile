/**
 * ChartPoint:
 *
 * This module works with objects in the form
 * {
 *  w: Number,
 *  y: Number
 * }
 *
 * These represent points on either an intensity, transmittance, or
 * absorption chart
 */

/**
 * Constructs a calibration point
 * @param {number} wavelength wavelength to be associated with xPosition
 * @param {number} y intensity, transmittance, or absorbance
 * @returns {ChartPt}
 */
export const construct = (wavelength, y) => ({
  w: wavelength,
  y,
});

/**
 * Return the wavelength of a chart point
 * @param {ChartPt} chartPoint
 * @returns {number} the wavelength of the point
 */
export const getWavelength = (chartPoint) => chartPoint.w;

/**
 * Return the y value of a chart point
 * @param {ChartPt} chartPoint 
 * @returns {number} y: the intensity, transmittance, or absorption
 */
export const getY = (chartPoint) => chartPoint.y;
