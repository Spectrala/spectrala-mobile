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
    showsHelp: false,
  },
  reducers: {
    setPlacement: (state, action) => {
      const point = state.calibration[action.payload.targetIndex];
      CalibPt.setXPosition(point, action.payload.placement);
    },
    setPreset: (state, action) => {
      const preset = action.payload.preset;
      state.calibration = Calibration.fromPreset(preset);
    },
    setActivePointPlacement: (state, action) => {
      const isActivePointPlacement = action.payload.value;
      state.activePointPlacement = isActivePointPlacement;
    },
    restoreCalibration: (state, action) => {
      const { calibration, activePointPlacement } = action.payload.value;
      state.calibration = calibration;
      state.activePointPlacement = activePointPlacement;
    },
    toggleShowsHelp: (state, action) => {
      state.showsHelp = !state.showsHelp;
    },
  },
});

export const {
  setPlacement,
  setPreset,
  setActivePointPlacement,
  restoreCalibration,
  toggleShowsHelp,
} = calibrationSlice.actions;

export const selectCalibrationPoints = (state) => {
  return state.calibration.calibration;
};

export const selectActivePointPlacement = (state) =>
  state.calibration.activePointPlacement;

export const selectShowsHelp = (state) => state.calibration.showsHelp;

export default calibrationSlice.reducer;
