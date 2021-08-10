import {
  generateCSVString,
  generateXSLXWorksheet,
} from "../util/sheetUtil";
import * as HeaderRelation from "./HeaderRelation";
import { sanitizeNameForFilename } from "../util/sanitizeFilename";
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
 *  isReference: boolean,
 *  rows: Array<Object>,
 * }
 *
 * This represents a single recorded spectrum which can be exported
 * with the filename name and csv contents csvString.
 */

/**
 * Data columns for test spectra (spectrum with a reference spectrum)
 */
const SPECTRUM_HEADER_RELATIONS_TEST = [
  HeaderRelation.construct("wavelength", "Wavelength (nm)"),
  HeaderRelation.construct("intensity", "Intensity (%)"),
  HeaderRelation.construct("transmittance", "Transmittance"),
  HeaderRelation.construct("absorbance", "Absorbance"),
];

/**
 * Data columns for reference spectra. (spectrum without a different
 * reference spectrum)
 */
const SPECTRUM_HEADER_RELATIONS_REFERENCE = [
  HeaderRelation.construct("wavelength", "Wavelength"),
  HeaderRelation.construct("intensity", "Intensity"),
];

/**
 * Calculates the transmittance/absorbance for a test spectrum
 * based off of a reference spectrum. Results are used as data
 * for a table alongside the intensity/wavelength data from the
 * test chart. SPECTRUM_HEADER_RELATIONS_TEST are used as columns.
 * @param {Array<ChartPt>} testChart
 * @param {Array<ChartPt>} referenceChart
 * @returns {Array<Object>} Array of objects representing rows in spreadsheet
 */
const getTestSpectrumRows = (testChart, referenceChart) => {
  const intensity = testChart;
  const transmittance = computeTransmittanceChart(testChart, referenceChart);
  const absorbance = computeAbsorbanceChart(testChart, referenceChart);
  const rows = intensity.map((intensityPt, idx) => ({
    wavelength: ChartPt.getWavelength(intensityPt),
    intensity: ChartPt.getY(intensityPt),
    transmittance: ChartPt.getY(transmittance[idx]),
    absorbance: ChartPt.getY(absorbance[idx]),
  }));
  return rows;
};

/**
 * Encodes wavelength and intensity as data rows for a reference
 * spectrum. Absorbance and transmittance are not computed.
 * SPECTRUM_HEADER_RELATIONS_REFERENCE are used as columns.
 * @param {Array<ChartPt>} intensityChart
 * @returns {Array<Object>} Array of objects representing rows in spreadsheet
 */
const getReferenceSpectrumRows = (intensityChart) => {
  const rows = intensityChart.map((intensityPt) => ({
    wavelength: ChartPt.getWavelength(intensityPt),
    intensity: ChartPt.getY(intensityPt),
  }));
  return rows;
};

/**
 * Creates a SpectrumExport from a spectrum and optionally a referenceSpectrum.
 * If there is a referenceSpectrum which does not have an identical key to the
 * first spectrum, transmittance and absorbance are computed in the CSV.
 * @param {Array<ChartPt>} spectrum focal spectrum for the intensity column
 * @param {Array<ChartPt> | null} referenceSpectrum reference spectrum, if any
 * @returns {SpectrumExport}
 */
export const construct = (spectrum, referenceSpectrum) => {
  const name = sanitizeNameForFilename(Spectrum.getName(spectrum));
  const isReference =
    !referenceSpectrum ||
    Spectrum.getKey(spectrum) === Spectrum.getKey(referenceSpectrum);
  let rows;
  if (isReference) {
    const intensities = Spectrum.getIntensityChart(spectrum);
    rows = getReferenceSpectrumRows(intensities);
  } else {
    const testIntensities = Spectrum.getIntensityChart(spectrum);
    const refIntensities = Spectrum.getIntensityChart(referenceSpectrum);
    rows = getTestSpectrumRows(testIntensities, refIntensities);
  }
  return {
    name,
    isReference,
    rows,
  };
};

export const getIsReference = (spectrumExport) => {
  return spectrumExport.isReference;
};

export const getHeaderRelations = (spectrumExport) => {
  return getIsReference(spectrumExport)
    ? SPECTRUM_HEADER_RELATIONS_REFERENCE
    : SPECTRUM_HEADER_RELATIONS_TEST;
};

export const getRows = (spectrumExport) => {
  return spectrumExport.rows;
};

export const getCSVString = (spectrumExport) => {
  const headerRelations = getHeaderRelations(spectrumExport);
  const rows = getRows(spectrumExport);
  return generateCSVString(headerRelations, rows);
};

export const getExcelWorksheet = (spectrumExport) => {
  const headerRelations = getHeaderRelations(spectrumExport);
  const rows = getRows(spectrumExport);
  return generateXSLXWorksheet(headerRelations, rows);
};

export const getName = (spectrumExport) => {
  return spectrumExport.name;
};
