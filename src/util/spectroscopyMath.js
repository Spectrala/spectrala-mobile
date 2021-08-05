import * as Cartesian from "../types/Cartesian";
import * as UncalibratedIntensity from "../types/UncalibratedIntensity";
import * as ChartPt from "../types/ChartPoint";

/**
 * Averages multiple arrays element-wise.
 * @param {Array<Array<Number>>} intensityArrayHistory Previous intensity arrays
 * @returns {Array<Number>} All intensity arrays, averaged.
 */
const getAverageOfLineHistory = (intensityArrayHistory) => {
  if (!intensityArrayHistory || intensityArrayHistory.length === 0) {
    return null;
  }
  const pixelLines = intensityArrayHistory;
  let averagedLine = [];
  const len = pixelLines[0].length;
  for (let i = 0; i < len; i++) {
    let column = [];
    for (let j = 0; j < pixelLines.length; j++) {
      column.push(pixelLines[j][i]);
    }
    averagedLine.push(column.reduce((a, b) => a + b, 0) / pixelLines.length);
  }
  return averagedLine;
};

/**
 * Assigns x values to intensityArrayHistory to get an
 * unclaibrated intensity chart.
 * @param {Array<Number>} intensityArrayHistory
 * @returns {Array<UncalibratedIntensity>}
 */
export const getUncalibratedIntensities = (intensityArrayHistory) => {
  const intensitiesArr = getAverageOfLineHistory(intensityArrayHistory);
  if (!intensitiesArr) {
    return null;
  }
  return intensitiesArr.map((intensity, idx) => {
    const x = idx / (intensitiesArr.length - 1);
    return UncalibratedIntensity.construct(x, intensity);
  });
};

/**
 * Process for calibration:
 *
 * Input a raw array of pixel intensities and calibration points and output
 * an array of wavelength and intensitiy pairs. The method used to do this is:
 *   1. Assign each calibration point an x value of placement and a y value of
 *      wavelength
 *   2. Use point-slope to get a straight line between the points with the
 *      lowest x and highest x
 *   3. Use linearSpline to draw a linear spline through all points
 *   4. Create a wavelength(x) function which uses the line from step 3 for x
 *      values between the two endpoints and otherwise the line from step 2
 *   5. Map all pixel intensities to wavelength values
 *      i. Calculate position fom 0 to 1 inside the array
 *      ii. Use value from step 5i for wavelength(x)
 *      iii. return SpectrumPoint { w: wavelength(x), y: pixel intensity }
 */

/**
 * Return calibrated intensities from uncalibratedIntensities and a calibration
 * @param {Array<UncalibratedIntensity>} uncalibratedIntensities
 * @param {Calibration} calibration
 * @returns {Array<ChartPt>} calibrated intensities chart
 */
export const computeIntensityChart = (uncalibratedIntensities, calibration) => {
  // Convert points from CalibPt to Cartesian
  const pts = calibration.map((point) => Cartesian.fromCalibPt(point));

  // Get endpoints
  const lowerBound = pts[0];
  const upperBound = pts[pts.length - 1];

  // If a point falls on the end, only compute wavelength with endpoints
  const w_end = Cartesian.getPointSlopeEquation(lowerBound, upperBound);

  // If a point falls in the middle, compute wavelength with nearest calibration points
  const w_middle = (x) => Cartesian.interpolateYFromData(pts, x);

  const wavelength = (x) => {
    if (pts.length < 3) return w_end(x);
    if (x > lowerBound.x && x < upperBound.x) return w_middle(x);
    return w_end(x);
  };

  return uncalibratedIntensities.map(({ x: xPosition, i: intensity }) =>
    ChartPt.construct(xPosition, wavelength(xPosition), intensity)
  );
};

/**
 * Get the intensity in an intensity chart with a wavelength closest
 * to a given wavelength from a test chart.
 * @param {Number} testWavelength wavelength from a testIntensityChart
 * @param {Array<ChartPt>} intensityChart
 * @returns {Number} intensity from intensityChart
 */
export const getClosestIntensity = (testWavelength, intensityChart) => {
  const closestPoint = intensityChart.reduce((pointA, pointB) => {
    const wavelengthA = ChartPt.getWavelength(pointA);
    const wavelengthB = ChartPt.getWavelength(pointB);
    const distanceA = Math.abs(testWavelength - wavelengthA);
    const distanceB = Math.abs(testWavelength - wavelengthB);
    return distanceA < distanceB ? pointA : pointB;
  });
  return ChartPt.getY(closestPoint);
};

/**
 * Given a test spectrum and reference spectrum (both in terms of intensity),
 * returns the transmittance spectrum.
 * @param {Array<ChartPt>} testIntensityChart intensity of test sample
 * @param {Array<ChartPt>} referenceIntensityChart intensity of reference sample
 * @returns {Array<ChartPt>} transmittance of test sample
 */
export const computeTransmittanceChart = (
  testIntensityChart,
  referenceIntensityChart
) => {
  const transmittanceChart = testIntensityChart.map((testPoint) => {
    const testWavelength = ChartPt.getWavelength(testPoint);
    const testIntensity = ChartPt.getY(testPoint);
    const referenceIntensity = getClosestIntensity(
      testWavelength,
      referenceIntensityChart
    );
    let transmittance = 0;
    if (referenceIntensity !== 0) {
      transmittance = testIntensity / referenceIntensity;
    }
    const xPosition = ChartPt.getXPosition(testPoint);
    return ChartPt.construct(xPosition, testWavelength, transmittance);
  });
  return transmittanceChart;
};

/**
 * Given a test spectrum and reference spectrum (both in terms of intensity),
 * returns the absorption spectrum.
 * @param {Array<ChartPt>} testIntensityChart intensity of test sample
 * @param {Array<ChartPt>} referenceIntensityChart intensity of reference sample
 * @returns {Array<ChartPt>} absorption of test sample
 */
export const computeAbsorptionChart = (
  testIntensityChart,
  referenceIntensityChart
) => {
  const transmittanceChart = computeTransmittanceChart(
    testIntensityChart,
    referenceIntensityChart
  );
  const absorptionChart = transmittanceChart.map((transmittancePoint) => {
    const wavelength = ChartPt.getWavelength(transmittancePoint);
    const transmittance = ChartPt.getY(transmittancePoint);
    const absorption = -Math.log10(transmittance);
    const xPosition = ChartPt.getXPosition(transmittancePoint);
    return ChartPt.construct(xPosition, wavelength, absorption);
  });
  return absorptionChart;
};
