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
 * Constructs a calibration point, rounding wavelength to the nearest tenth
 * and xPosition to the nearest thousandth.
 * @param {number} xPosition horizontal position from the camera stream [0-1]
 * @param {number} wavelength wavelength to be associated with xPosition
 * @param {number} y intensity, transmittance, or absorbance
 * @returns {ChartPt}
 */
export const construct = (xPosition, wavelength, y) => {
  const w = Math.round(wavelength * 10) / 10;
  const x = Math.round(xPosition * 1000) / 1000;
  return {
    x,
    w,
    y,
  };
};

/**
 * Return the xPosition of a chart point
 * @param {ChartPt} chartPoint
 * @returns {number} the x position of the point
 */
export const getXPosition = (chartPoint) => chartPoint.x;

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
