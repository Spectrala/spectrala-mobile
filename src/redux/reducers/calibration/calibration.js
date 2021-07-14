import { createSlice } from "@reduxjs/toolkit";
import { expandPreset, defaultCalibration } from "./CalibrationConstants";

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
 *         },
 *      ]
 *  }
 */
export const calibrationSlice = createSlice({
  name: "calibration",
  initialState: {
    calibrationPoints: initializeCalibrationPoints(defaultCalibration),
    activePointPlacement: false,
  },
  reducers: {
    setPlacement: (state, action) => { 
      const points = state.calibrationPoints.value;
      const point = points[action.payload.targetIndex];
      point.placement = action.payload.placement;
    },
    setPreset: (state, action) => { 
      const preset = action.payload.preset;
      state.calibrationPoints = initializeCalibrationPoints(preset);
    },
    setCalibrationPoints: (state, action) => {
      const points = action.payload.value;
      state.calibrationPoints.value = addBulkCalibPt(points);
    },
    setActivePointPlacement: (state, action) => { 
      const isActivePointPlacement = action.payload.value;
      state.activePointPlacement = isActivePointPlacement;
    },
  },
});

export const {
  setPlacement,
  setPreset,
  setCalibrationPoints,
  setActivePointPlacement
} = calibrationSlice.actions;

export const selectCalibrationPoints = (state) => {
  return state.calibration.calibrationPoints.value;
};

export const selectActivePointPlacement = (state) =>
  state.calibration.activePointPlacement;

export default calibrationSlice.reducer;
