import { createSlice } from "@reduxjs/toolkit";

import { DEFAULT_CALIBRATION } from "./CalibrationConstants";

import * as CalibPt from "../../types/CalibrationPoint";
import * as Calibration from "../../types/Calibration";

/**
 * calibration {Calibration} the current placement of calibration ticks
 * activePointPlacement {Boolean} whether or not a tick is being dragged
 */
export const calibrationSlice = createSlice({
  name: "calibration",
  initialState: {
    calibration: Calibration.fromPreset(DEFAULT_CALIBRATION),
    activePointPlacement: false,
  },
  reducers: {
    setPlacement: (state, action) => {
      const point = state.calibration[action.payload.targetIndex];
      CalibPt.setXPosition(point, action.payload.x);
    },
    setPreset: (state, action) => {
      const preset = action.payload.preset;
      state.calibration = Calibration.fromPreset(preset);
    },
    setActivePointPlacement: (state, action) => {
      const isActivePointPlacement = action.payload.value;
      state.activePointPlacement = isActivePointPlacement;
    },
  },
});

export const { setPlacement, setPreset, setActivePointPlacement } =
  calibrationSlice.actions;

export const selectCalibrationPoints = (state) => {
  return state.calibration.calibration;
};

export const selectActivePointPlacement = (state) =>
  state.calibration.activePointPlacement;

export default calibrationSlice.reducer;
