import { createSlice } from '@reduxjs/toolkit';
import * as CalibPt from './calibration_point';
import {
    expandPreset,
    defaultCalibration,
} from './calibration_constants';

/**
 * addNewCalibPt
 *      Adds a new calibration point to the list
 *
 *      Returns: (array) -- the array of calibration points.
 */
const addNewCalibPt = (currentArray, newPoint) => {
    let key = newPoint.key;
    if (!key) {
        key = 1;
        if (currentArray.length > 0) {
            key = Math.max(...currentArray.map((obj) => obj.key)) + 1;
        }
    }
    currentArray.push({ key, ...newPoint });
    return currentArray;
};

const addBulkCalibPt = (currentPoints) => {
    // TODO: Find a more ES6 way of doing this
    let arr = [];
    currentPoints.forEach((pt) => (arr = addNewCalibPt(arr, pt)));
    return arr;
};

const initializeCalibrationPoints = (calibrationPoints) => {
    let obj = expandPreset(calibrationPoints);
    obj.value = addBulkCalibPt(obj.value);
    return obj;
};

/**
 * Calibration points object:
 *  Object consists of a title (like "CFL Bulb" or "Custom") and a
 *  value (array of calibration points),
 *
 * Example object:
 *  {
 *      title: "Custom",
 *      value: [
 *         {
 *             "wavelength":436,
 *             "placement":0.204,
 *             "isBeingPlaced":false,
 *         },
 *      ]
 *  }
 */
export const calibrationSlice = createSlice({
    name: 'calibration',
    initialState: {
        calibrationPoints: initializeCalibrationPoints(defaultCalibration),
    },
    reducers: {
        modifyWavelength: (state, action) => {
            const point =
                state.calibrationPoints.value[action.payload.targetIndex];
            CalibPt.setWavelength(point, action.payload.value);
            /** Make sure the point cannot be placed if the new value is invalid. */
            if (point.isBeingPlaced && !CalibPt.isValidToPlace(point)) {
                CalibPt.setPlacementStatus(point, false);
            }
        },
        removePoint: (state, action) => {
            state.calibrationPoints.value.splice(action.payload.targetIndex, 1);
        },
        saveCalibration: (state) => {
            console.log('Save the calibration');
        },
        addOption: (state) => {
            state.calibrationPoints.value = addNewCalibPt(
                state.calibrationPoints.value,
                CalibPt.construct(null, null, false)
            );
        },
        beginPlace: (state, action) => {
            const points = state.calibrationPoints.value;
            const targetIndex = action.payload.targetIndex;
            points.forEach((pt, idx) => {
                if (idx === targetIndex) {
                    CalibPt.setPlacementStatus(pt, true);
                    CalibPt.setPlacement(pt, null);
                } else {
                    CalibPt.setPlacementStatus(pt, false);
                }
            });
        },
        placePoint: (state, action) => {
            const points = state.calibrationPoints.value;
            const point = points[action.payload.targetIndex];
            const location = action.payload.value;
            CalibPt.setPlacementStatus(point, false);
            CalibPt.setPlacement(point, location);
        },
        cancelPlace: (state, action) => {
            const points = state.calibrationPoints.value;
            const point = points[action.payload.targetIndex];
            CalibPt.setPlacementStatus(point, false);
        },
        editPlacement: (state, action) => {
            const points = state.calibrationPoints.value;
            const point = points[action.payload.targetIndex];
            CalibPt.setPlacementStatus(point, true);
            CalibPt.setPlacement(point, null);
        },
        setPreset: (state, action) => {
            const preset = action.payload.preset;
            state.calibrationPoints = initializeCalibrationPoints(preset);
        },
        setCalibrationPoints: (state, action) => {
            const points = action.payload.value;
            state.calibrationPoints.value = addBulkCalibPt(points);
        },
    },
});

export const {
    saveCalibration,
    modifyWavelength,
    removePoint,
    addOption,
    beginPlace,
    placePoint,
    cancelPlace,
    editPlacement,
    setPreset,
    setCalibrationPoints,
} = calibrationSlice.actions;

export const selectCalibrationPoints = (state) => {
    return state.calibration.calibrationPoints.value;
};

export const selectTooltipLabel = (state) => {
    var pointBeingPlaced = null;
    state.calibrationPoints.value.forEach((point, idx) => {
        if (point.isBeingPlaced) {
            pointBeingPlaced = point;
        }
    });
    return pointBeingPlaced;
};

export default calibrationSlice.reducer;
