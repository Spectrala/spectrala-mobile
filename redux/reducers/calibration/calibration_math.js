import SpectralDataResponse from '../spectral_data_response';

export const validateCalibrationPoints = (calibrationPoints) => {
    // Make sure all points are placed.
    const noNulls = calibrationPoints.every(
        (p) => p && p.rawWavelength && p.placement
    );
    if (!noNulls)
        return new SpectralDataResponse({
            valid: false,
            message:
                'All calibration points must be placed before creating a spectrum.',
        });

    // Make sure there are at least 2 points.
    if (calibrationPoints.length < 2)
        return new SpectralDataResponse({
            valid: false,
            message:
                'Waiting for at least two calibratin points to create a spectrum.',
        });

    // Sort the calibration points by wavelength
    const sortedPoints = calibrationPoints.sort(
        (a, b) => a.rawWavelength - b.rawWavelength
    );

    // Verify these points are also sorted by placement
    for (var i = 0; i < sortedPoints.length - 1; i++) {
        if (sortedPoints[i + 1].placement < sortedPoints[i].placement)
            return new SpectralDataResponse({
                valid: false,
                message: 'Calibration points must go in order of wavelength.',
            });
    }

    return new SpectralDataResponse({ valid: true, data: sortedPoints });
};

const cartesian = (point) => {
    return { x: point.placement, y: point.rawWavelength };
};

const pointSlope = (a, b) => {
    const m = (b.y - a.y) / (b.x - a.x);
    const equation = (x) => m * (x - a.x) + a.y;
    return equation;
};


const linearSpline = (pts, x) => {
    for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        if (a.x <= x && x <= b.x) {
            return pointSlope(a, b)(x);
        }
    }
    return null;
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
 *      Returns: (array) Pixel intensities at wavelengths. Looks like this: [{ x: wavelength(x), y: pixel intensity }]
 */
export const getCalibratedSpectrum = (intensities, sortedCalibrationPoints) => {
    // Convert points to cartesian
    const pts = sortedCalibrationPoints.map((point) => cartesian(point));

    // Get endpoints
    const a = pts[0];
    const b = pts[pts.length - 1];

    const w_end = pointSlope(a, b);

    const w_middle = (x) => linearSpline(pts, x);

    const wavelength = (x) => {
        if (pts.length < 3) return w_end(x);
        if (x > a.x && x < b.x) return w_middle(x);
        return w_end(x);
    };

    if (!intensities) {
        console.warn('Got null intensities');
        return;
    }


    return intensities.map((y, idx) => {
        const x_position = idx / (intensities.length - 1);
        return {
            x: wavelength(x_position),
            y: y,
        };
    });
};
