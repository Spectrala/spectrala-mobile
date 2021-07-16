import { createSlice } from "@reduxjs/toolkit";

import { DEFAULT_CALIBRATION } from "./CalibrationConstants";

import * as CalibPt from "../../../types/CalibrationPoint";
import * as Calibration from "../../../types/Calibration";

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
    calibrationPoints: Calibration.fromPreset(DEFAULT_CALIBRATION),
    activePointPlacement: false,
  },
  reducers: {
    setPlacement: (state, action) => {
      const points = state.calibrationPoints.value;
      const point = points[action.payload.targetIndex];
      CalibPt.setXPosition(point, action.payload.x);
    },
    setPreset: (state, action) => {
      const preset = action.payload.preset;
      state.calibrationPoints = Calibration.fromPreset(preset);
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
