/**
 * CalibPreset:
 *
 * This module works with objects in the form
 * {
 *  title: String,
 *  wavelengths: Array<Number>
 * }
 *
 * These represent the ticks on the graph during calibration.
 */

/**
 * Constructs a calibration preset
 * @param {String} title name of the preset
 * @param {Array<Number>} wavelengths wavelengths for the preset's calibraiton points
 * @returns {CalibPreset}
 */
export const construct = (title, wavelengths) => ({ title, wavelengths });

/**
 * Return the x position of a calibration point
 * @param {CalibPt} calibrationPoint
 * @returns {number} the x position of the point
 */
export const getTitle = (calibrationPreset) => calibrationPoint.x;

/**
 * Return the wavelength of a calibration point
 * @param {CalibPt} calibrationPoint
 * @returns {number} the wavelength of the point
 */
export const getWavelength = (calibrationPoint) => calibrationPoint.w;
