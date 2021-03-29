import { createSlice } from '@reduxjs/toolkit';
import { selectIntensities } from './video';
import { selectCalibrationPoints } from './calibration/calibration';
import * as CalibPt from './calibration/calibration_point';
import {
    validateCalibrationPoints,
    getCalibratedSpectrum,
} from './calibration/calibration_math';
import SpectralDataResponse from './spectral_data_response';

// Default name prefix for saving a spectrum. Will start naming as DEFAULT_NAME 1.
const DEFAULT_NAME = 'New Spectrum ';

/**
 * FULL_SPECTRUM
 *      Default spectrum to pass to resultant when nothing is selected.
 *      This works because of the nearest-neighbor method in the resultant spectrum.
 *      Since there is only one x-value, it is the closest x value (which has a y component of 0).
 */
// const FULL_SPECTRUM = [{ x: 0, y: 1 }];

/**
 * SPECTRUM_OPTIONS
 *      The different ways the user can view the spectrum.
 *      Absorbance is the only option without a reference spectrum.
 */
export const SPECTRUM_OPTIONS = {
    ABSORBANCE: 'Absorbance',
    TRANSMITTANCE: 'Transmittance',
    INTENSITY: 'Intensity',
};

/**
 * addNewSpectrum
 *      Adds a new spectrum to the list of stored spectra.
 *
 *      Returns: (array) -- the array of recorded spectra.
 *      Format:
 *      [{
 *          key: 2
 *          name: "Water"
 *          data: [{x: 338.3, y: 44.2}]
 *      }]
 * @param {array} currentArray - the current array of recorded spectra
 * @param {array} data - the spectral data to record in the recorded spectra array
 * @param {string} defaultName - the default prefix to append before the key in naming the specta
 */
export const addNewSpectrum = (currentArray, data, defaultName) => {
    let key = 1;
    if (currentArray.length > 0) {
        key = Math.max(...currentArray.map((ref) => ref.key)) + 1;
    }
    const name = defaultName + key;
    currentArray.push({
        key: key,
        name: name,
        data: data,
        isReference: false,
    });
    return currentArray;
};

export const setIsReferenceFalse = (currentArray) => {
    return currentArray.map((pt) => {
        let newObj = Object.assign({}, pt);
        newObj.isReference = false;
        return newObj;
    });
};

export const spectrumSlice = createSlice({
    name: 'spectra',
    initialState: {
        spectrum: null,
        recorded_spectra: [],
        key_being_used: null,
        preferredSpectrum: SPECTRUM_OPTIONS.INTENSITY,
    },
    reducers: {
        recordSpectrum: (state, action) => {
            // TODO: Verify spectrum is okay. Right now that is only done in the button.
            const data = action.payload.data;
            const refs = state.recorded_spectra;
            const recorded = addNewSpectrum(refs, data, DEFAULT_NAME);

            // To automatically use the reference
            state.key_being_used = recorded[recorded.length - 1].key;
            state.recorded_spectra = recorded;
        },
        removeSpectrum: (state, action) => {
            const idx = action.payload.targetIndex;
            let recorded = state.recorded_spectra;
            recorded.splice(idx, 1);
            state.recorded_spectra = recorded;
        },
        renameSpectrum: (state, action) => {
            const idx = action.payload.targetIndex;
            const name = action.payload.name;
            let recorded = state.recorded_spectra;
            recorded[idx].name = name;
            state.recorded_spectra = recorded;
        },
        removeReference: (state, action) => {
            state.recorded_spectra = setIsReferenceFalse(
                state.recorded_spectra
            );
            state.preferredSpectrum = SPECTRUM_OPTIONS.INTENSITY;
        },
        setReference: (state, action) => {
            const idx = action.payload.targetIndex;
            let recorded = setIsReferenceFalse(state.recorded_spectra);
            recorded[idx].isReference = true;
            state.recorded_spectra = recorded;
        },
        setRecordedSpectra: (state, action) => {
            const recorded = action.payload.value;
            state.recorded_spectra = recorded;
        },
        setPreferredSpectrum: (state, action) => {
            state.preferredSpectrum = action.payload.preferredSpectrum;
        },
    },
});

export const {
    recordSpectrum,
    removeSpectrum,
    renameSpectrum,
    removeReference,
    setReference,
    setPreferredSpectrum,
    setRecordedSpectra,
} = spectrumSlice.actions;

/**
 * selectValidateCalibrationPoints
 *      Gets the calibration points in the currently used calibration.
 *
 *      Returns: SpectralDataResponse. If there is data, it looks like this: [CalibrationPoint].
 */
export const selectValidateCalibrationPoints = (state) => {
    const calibrationPoints = selectCalibrationPoints(state).map(
        CalibPt.getPlacementLocationDescription
    );
    return validateCalibrationPoints(calibrationPoints);
};

/**
 * selectValidateCalibratedPixelLine
 *      Gets the pixel line (raw from the camera source) after validating
 *      that the data exists to do the calibration.
 *
 *      Returns: SpectralDataResponse. If there is data, it looks like this: [{x: 338.3, y: 44.2}].
 */
export const selectValidateCalibratedPixelLine = (state) => {
    const intensities = selectIntensities(state);

    const calibrationPoints = selectValidateCalibrationPoints(state);
    if (!calibrationPoints.isValid()) return calibrationPoints;

    if (!intensities) {
        return new SpectralDataResponse({
            valid: false,
            message: 'Waiting...',
        });
    }

    return new SpectralDataResponse({
        valid: true,
        data: getCalibratedSpectrum(intensities, calibrationPoints.getData()),
    });
};

export const selectPreferredSpectrumOption = (state) => {
    return state.spectra.preferredSpectrum;
};

export const selectHasReference = (state) => !!selectReferenceIntensity(state);

// FOR DOWNLOADING CSV
export const selectIntensity = (state) => {
    const pixelLine = selectValidateCalibratedPixelLine(state);
    if (!pixelLine.valid) return pixelLine;
    return pixelLine.data;
};
export const selectTransmittance = (state) => {
    const intensity = selectIntensity(state);
    const reference = selectReferenceIntensity(state);
    return computeTransmittance(intensity, reference);
};
export const selectAbsorbance = (state) => {
    const intensity = selectIntensity(state);
    const reference = selectReferenceIntensity(state);
    return computeAbsorbance(intensity, reference);
};

/**
 * selectValidateLiveSpectrum
 *      Get the line graph data to show in the Spectrum component.
 *
 *      Returns: array. Looks like this: [{x: 338.3, y: 44.2}].
 */
export const selectValidateLiveSpectrum = (state) => {
    // TODO: allow user to view old reference spectra.
    const spectrumOption = selectPreferredSpectrumOption(state);
    if (spectrumOption === SPECTRUM_OPTIONS.INTENSITY) {
        return selectValidateCalibratedPixelLine(state);
    } else if (spectrumOption === SPECTRUM_OPTIONS.TRANSMITTANCE) {
        return new SpectralDataResponse({
            valid: true,
            data: selectTransmittance(state),
        });
    } else if (spectrumOption === SPECTRUM_OPTIONS.ABSORBANCE) {
        return new SpectralDataResponse({
            valid: true,
            data: selectAbsorbance(state),
        });
    }
    console.error(`Received unexpected spectrum option of ${spectrumOption}`);
    return null;
};

/**
 * selectReferenceIntensity
 *      Get the intensity values of the reference spectrum used for creating a resultant spectrum.
 *      This will be what the user has selected.
 *
 *      Returns: array. Looks like this: [{x: 338.3, y: 44.2}].
 */
export const selectReferenceIntensity = (state) => {
    const reference = state.spectra.recorded_spectra.filter(
        (s) => s.isReference
    );
    if (reference.length === 0) {
        return null;
    }
    return reference[0].data;
};

// TODO: make this look professional
// get nearest neighbor (in x position) to a parent x value of neighborArray and return the neighborArray y value.
const getNeighborY = (parentX, neighborArray) => {
    if (!neighborArray) {
        console.error('Tried to compute neighbor Y of a null array');
        return null;
    }

    const closest = neighborArray.reduce((a, b) => {
        return Math.abs(a.x - parentX) < Math.abs(b.x - parentX) ? a : b;
    });
    return closest.y;
};

export const computeTransmittance = (target, reference) => {
    let transmittance = target.map((t) => {
        const r = getNeighborY(t.x, reference);
        const transmit = r === 0 ? 0 : t.y / r;
        return { x: t.x, y: transmit };
    });
    return transmittance;
};

export const computeAbsorbance = (target, reference) => {
    let transmittance = computeTransmittance(target, reference);
    let absorbance = transmittance.map((t) => {
        return { x: t.x, y: -Math.log10(t.y) };
    });
    return absorbance;
};

/**
 * selectRecordedSpectra
 *      Returns (array) -- the list of recorded spectra.
 *      Format:
 *      [{
 *          key: 2
 *          name: "Water"
 *          data: [{x: 338.3, y: 44.2}]
 *      }]
 */
export const selectRecordedSpectra = (state) => {
    return state.spectra.recorded_spectra;
};

export default spectrumSlice.reducer;
