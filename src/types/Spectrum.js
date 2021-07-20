/**
 * This module deals with objects in the following form:
 *
 * {
 *  key: Number,
 *  name: String,
 *  intensityChart: Array<ChartPt>
 * }
 *
 * This is the format in which spectra will be stored.
 *
 */

// Default name prefix for saving a spectrum. Will start naming as DEFAULT_NAME 1.
const DEFAULT_NAME = "New Spectrum ";

/**
 * Constructs a Spectrum
 * @param {Number} key unique integer for the spectrum
 * @param {String} name name of the spectrum
 * @param {Array<ChartPt>} intensityChart calibrated intensities
 * @returns {Spectrum}
 */
export const construct = (key, name, intensityChart) => ({
  key,
  name,
  intensityChart,
});

/**
 * Constructs a Spectrum with a default name.
 * Example: {key: 4, name: "New Spectrum 4", intensityChart }
 * @param {Array<ChartPt>} intensityChart calibrated intensities
 * @param {Number} key unique integer for the spectrum
 * @returns {Spectrum} spectrum with intensities and generated key, name fields.
 */
export const constructDefault = (intensityChart, key) => {
  const name = DEFAULT_NAME + key;
  // const spectrum = construct(key, name, intensityChart);
  return {
    key,
    name,
    intensityChart,
  };
};

/**
 * Return the intensity chart for the spectrum
 * @param {Spectrum} spectrum
 * @returns {Array<ChartPt>} intensity chart
 */
export const getIntensityChart = (spectrum) => spectrum.intensityChart;

/**
 * Return the name of the spectrum
 * @param {Spectrum} spectrum
 * @returns {String} name
 */
export const getName = (spectrum) => spectrum.name;

/**
 * Return the key of the spectrum
 * @param {Spectrum} spectrum
 * @returns {Number} key
 */
export const getKey = (spectrum) => spectrum.key;

/**
 * Creates a new spectrum with a specified new name.
 * Does not mutate the original spectrum.
 * @param {Spectrum} spectrum
 * @param {String} newName string to which the name should be changed.
 * @returns {Spectrum} the spectrum with a new name.
 */
export const rename = (spectrum, newName) => ({ ...spectrum, name: newName });
