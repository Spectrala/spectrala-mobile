import * as CalibPreset from "./CalibrationPreset";
import * as CalibPt from "./CalibrationPoint";

/**
 * Calibration:
 *
 * This module works with arrays of CalibPt objects.
 *
 * This will be used to calibrate intensities.
 */

/**
 * Assigns each wavelength in the preset a default x value
 * and returns as a calibration.
 * @param {CalibPreset} preset
 * @returns {Calibration} calibration from the preset wavelengths
 */
export const fromPreset = (preset) => {
  const wavelengths = CalibPreset.getWavelengths(preset);
  const count = wavelengths.length;
  return wavelengths.map((w, idx) => {
    const x = (idx + 0.5) / count;
    return CalibPt.construct(x, w);
  });
};
