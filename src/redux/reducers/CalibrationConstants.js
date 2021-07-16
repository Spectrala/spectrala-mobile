import * as CalibPreset from "../../../types/CalibrationPreset";

export const MAX_POINTS = 5;

export const CALIBRATION_PRESETS = [
  CalibPreset.construct("Custom", [0, 0]),
  CalibPreset.construct("CFL Bulb", [436, 546, 604]),
  CalibPreset.construct("Ch3A Lab Kit", [400, 530, 875, 940]),
  CalibPreset.construct("Spectrala", [458, 530, 623]),
];

export const DEFAULT_CALIBRATION = calibrationPresets[3];
