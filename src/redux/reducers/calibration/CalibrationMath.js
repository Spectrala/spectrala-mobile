import * as CalibPt from "../../../types/CalibrationPoint";


const getUncalibratedIntensitiesArray = (pixelLineHistory) => {
  if (pixelLineHistory && pixelLineHistory.length > 0) {
    const pixelLines = pixelLineHistory;
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
  }
  return null;
};

const getUncalibratedIntensities = (intensitiesArray) => {
  if (!intensitiesArray) {
    return null;
  }
  return intensitiesArray.map((intensity, idx) => ({
    x: idx / (intensitiesArray.length - 1),
    i: intensity,
  }));
};

/**
 * getCalibratedSpectrum:
 *      Input a raw array of pixel intensities and calibration points and output an array of wavelength and intensitiy pairs.
 *      The method used to do this is
 *          1. Assign each calibration point an x value of placement and a y value of wavelength
 *          2. Use point-slope to get a straight line between the points with the lowest x and highest x
 *          3. Use linearSpline to draw a linear spline through all points
 *          4. Create a wavelength(x) function which uses the line from step 3 for x values between the two endpoints and otherwise the line from step 2
 *          5. Map all pixel intensities to wavelength values
 *              i. Calculate position fom 0 to 1 inside the array
 *              ii. Use value from step 5i for wavelength(x)
 *              iii. return { x: wavelength(x), y: pixel intensity }
 *
 *      Returns: (array) Pixel intensities at wavelengths. Looks like this: [{ w: wavelength(x), y: pixel intensity }]
 */
export const getCalibratedIntensities = (
  pixelLineHistory,
  sortedCalibrationPoints
) => {
  const intensityArr = getUncalibratedIntensitiesArray(pixelLineHistory);
  const uncalibratedIntensities = getUncalibratedIntensities(intensityArr);

  // Convert points from CalibPt to cartesian ()
  const pts = sortedCalibrationPoints.map((point) =>
    CalibPt.getCartesian(point)
  );

  // Get endpoints
  const lowerBound = pts[0];
  const upperBound = pts[pts.length - 1];

  // If a point falls on the end, only compute wavelength with endpoints
  const w_end = pointSlope(lowerBound, upperBound);

  // If a point falls in the middle, compute wavelength with nearest calibration points
  const w_middle = (x) => linearSpline(pts, x);

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
