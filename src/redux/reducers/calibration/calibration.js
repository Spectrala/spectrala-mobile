import { createSlice } from "@reduxjs/toolkit";
import { expandPreset, defaultCalibration } from "./CalibrationConstants";
import * as CalibPt from "../../../types/CalibrationPoint";

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
      point.x = action.payload.x;
    },
    setPreset: (state, action) => {
      const preset = action.payload.preset;
      state.calibrationPoints = initializeCalibrationPoints(preset);
    },
    setCalibrationPoints: (state, action) => {
      const points = action.payload.value;
      state.calibrationPoints.value = [...points];
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
  setActivePointPlacement,
} = calibrationSlice.actions;

export const selectCalibrationPoints = (state) => {
  return state.calibration.calibrationPoints.value;
};

export const selectActivePointPlacement = (state) =>
  state.calibration.activePointPlacement;

export default calibrationSlice.reducer;
