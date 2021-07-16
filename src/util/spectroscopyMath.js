import * as Cartesian from "../types/Cartesian";
import * as UncalibratedIntensity from "../types/UncalibratedIntensity";

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
 * @returns {Array<UncalibratedIntensity}
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
 * Input a raw array of pixel intensities and calibration points and output an array of wavelength and intensitiy pairs.
 * The method used to do this is
 *   1. Assign each calibration point an x value of placement and a y value of wavelength
 *   2. Use point-slope to get a straight line between the points with the lowest x and highest x
 *   3. Use linearSpline to draw a linear spline through all points
 *   4. Create a wavelength(x) function which uses the line from step 3 for x values between the two endpoints and otherwise the line from step 2
 *   5. Map all pixel intensities to wavelength values
 *      i. Calculate position fom 0 to 1 inside the array
 *      ii. Use value from step 5i for wavelength(x)
 *      iii. return SpectrumPoint { w: wavelength(x), y: pixel intensity }
 */

/**
 *
 * @param {Array<UncalibratedIntensity} uncalibratedIntensities
 * @param {Calibration} calibration
 * @returns {Array<Char....t>}
 */
export const getCalibratedIntensities = (
  uncalibratedIntensities,
  calibration
) => {
  // Convert points from CalibPt to Cartesian
  const pts = calibration.map((point) => Cartesian.fromCalibPt(point));

  // Get endpoints
  const lowerBound = pts[0];
  const upperBound = pts[pts.length - 1];

  // If a point falls on the end, only compute wavelength with endpoints
  const w_end = Cartesian.pointSlope(lowerBound, upperBound);

  // If a point falls in the middle, compute wavelength with nearest calibration points
  const w_middle = (x) => Cartesian.linearSpline(pts, x);

  const wavelength = (x) => {
    if (pts.length < 3) return w_end(x);
    if (x > lowerBound.x && x < upperBound.x) return w_middle(x);
    return w_end(x);
  };

  return uncalibratedIntensities.map(({ x: xPosition, i: intensity }) => ({
    w: wavelength(xPosition),
    y: intensity,
  }));
};



