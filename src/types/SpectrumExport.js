import { constructHeaderRelation, getCSVString } from "../util/csvUtil";
import {
  computeAbsorbanceChart,
  computeTransmittanceChart,
} from "../util/spectroscopyMath";

import * as ChartPt from "./ChartPoint";
import * as Spectrum from "./Spectrum";


/**
 * This module deals with objects in the following form:
 * 
 * {
 *  name: String,
 *  csvString: String,
 * }
 * 
 * This represents a single recorded spectrum which can be exported
 * with the filename name and csv contents csvString.
 */

/**
 * Data columns for test spectra (spectrum with a reference spectrum)
 */
const SPECTRUM_HEADER_RELATIONS_TEST = [
  constructHeaderRelation("wavelength", "Wavelength (nm)"),
  constructHeaderRelation("intensity", "Intensity (%)"),
  constructHeaderRelation("transmittance", "Transmittance"),
  constructHeaderRelation("absorbance", "Absorbance"),
];

/**
 * Data columns for reference spectra. (spectrum without a different
 * reference spectrum)
 */
const SPECTRUM_HEADER_RELATIONS_REFERENCE = [
  constructHeaderRelation("wavelength", "Wavelength"),
  constructHeaderRelation("intensity", "Intensity"),
];

/**
 * Calculates the transmittance/absorbance for a test spectrum
 * based off of a reference spectrum. Results are used as data
 * for a CSV alongside the intensity/wavelength data from the 
 * test chart. SPECTRUM_HEADER_RELATIONS_TEST are used as columns. 
 * @param {Array<ChartPt>} testChart
 * @param {Array<ChartPt>} referenceChart
 * @returns {String} CSV string representing the spectrum
 */
const getTestSpectrumAsCSVString = (testChart, referenceChart) => {
  const headerRelations = SPECTRUM_HEADER_RELATIONS_TEST;
  const intensity = testChart;
  const transmittance = computeTransmittanceChart(testChart, referenceChart);
  const absorbance = computeAbsorbanceChart(testChart, referenceChart);
  const rows = intensity.map((intensityPt, idx) => ({
    wavelength: ChartPt.getWavelength(intensityPt),
    intensity: ChartPt.getY(intensityPt),
    transmittance: ChartPt.getY(transmittance[idx]),
    absorbance: ChartPt.getY(absorbance[idx]),
  }));
  return getCSVString(headerRelations, rows);
};

/**
 * Encodes wavelength and intensity as a CSV for a reference
 * spectrum. Absorbance and transmittance are not computed.
 * SPECTRUM_HEADER_RELATIONS_REFERENCE are used as columns. 
 * @param {Array<ChartPt>} intensityChart 
 * @returns {String} CSV string representing the spectrum
 */
const getReferenceSpectrumAsCSVString = (intensityChart) => {
  const headerRelations = SPECTRUM_HEADER_RELATIONS_REFERENCE;
  const rows = intensityChart.map((intensityPt) => ({
    wavelength: ChartPt.getWavelength(intensityPt),
    intensity: ChartPt.getY(intensityPt),
  }));
  return getCSVString(headerRelations, rows);
};

/**
 * Cleans a name of a spectrum for usage as a filename. 
 * Replaces all spaces in a string iwth underscores.
 * @param {String} name a filename
 * @returns {String} the sanitized name
 */
const sanitizeName = (name) => {
  return name.replace(" ", "_");
};

/**
 * 
 * @param {Array<ChartPt>} spectrum 
 * @param {Array<ChartPt> | null} referenceSpectrum 
 * @returns {SpectrumExport} 
 */
export const construct = (spectrum, referenceSpectrum) => {
  const name = sanitizeName(Spectrum.getName(spectrum));
  const isReference =
    Spectrum.getKey(spectrum) === Spectrum.getKey(referenceSpectrum);
  
  let csvString = "";
  if (isReference) {
    const intensities = Spectrum.getIntensityChart(spectrum);
    csvString = getReferenceSpectrumAsCSVString(intensities);
  } else {
    const testIntensities = Spectrum.getIntensityChart(spectrum);
    const refIntensities = Spectrum.getIntensityChart(referenceSpectrum);
    csvString = getTestSpectrumAsCSVString(testIntensities, refIntensities);
  }
  return { name, csvString };
};
