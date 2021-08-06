import { constructHeaderRelation, getCSVString } from "../util/csvUtil";
import {
  computeAbsorbanceChart,
  computeTransmittanceChart,
} from "../util/spectroscopyMath";

import * as ChartPt from "./ChartPoint";
import * as Spectrum from "./Spectrum";

const SPECTRUM_HEADER_RELATIONS_TEST = [
  constructHeaderRelation("wavelength", "Wavelength (nm)"),
  constructHeaderRelation("intensity", "Intensity (%)"),
  constructHeaderRelation("transmittance", "Transmittance"),
  constructHeaderRelation("absorbance", "Absorbance"),
];

const SPECTRUM_HEADER_RELATIONS_REFERENCE = [
  constructHeaderRelation("wavelength", "Wavelength"),
  constructHeaderRelation("intensity", "Intensity"),
];

/**
 *
 * @param {Array<ChartPt>} testChart
 * @param {Array<ChartPt> | null} referenceChart
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

const getReferenceSpectrumAsCSVString = (intensityChart) => {
  const headerRelations = SPECTRUM_HEADER_RELATIONS_REFERENCE;
  const rows = intensityChart.map((intensityPt) => ({
    wavelength: ChartPt.getWavelength(intensityPt),
    intensity: ChartPt.getY(intensityPt),
  }));
  return getCSVString(headerRelations, rows);
};

const sanitizeName = (name) => {
  return name.replace(" ", "_");
};

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
