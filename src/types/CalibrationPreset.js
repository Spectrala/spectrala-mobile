/**
 * CalibPreset:
 *
 * This module works with objects in the form
 * {
 *  title: String,
 *  wavelengths: Array<number>
 * }
 *
 * These represent the ticks on the graph during calibration.
 */

/**
 * Constructs a calibration preset
 * @param {String} title name of the preset
 * @param {Array<number>} wavelengths wavelengths for the preset's calibraiton points
 * @returns {CalibPreset}
 */
export const construct = (title, wavelengths) => ({ title, wavelengths });

/**
 * Return the title of a calibration preset
 * @param {CalibPreset} preset
 * @returns {String} the title of the preset
 */
export const getTitle = (preset) => preset.x;

/**
 * Return the wavelengths of a calibration preset
 * @param {CalibPt} preset
 * @returns {Array<number>} the wavelengths of the preset
 */
export const getWavelengths = (preset) => preset.wavelengths;
