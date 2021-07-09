import * as CalibPt from "./calibration_point";

export const MAX_POINTS = 5;

export const calibrationPresets = [
  {
    id: "custom",
    title: "Custom",
    value: [0, 0],
  },
  {
    id: "cfl",
    title: "CFL Bulb",
    value: [436, 546, 604],
  },
  {
    id: "ch3aLab",
    title: "Ch3A Lab Kit",
    value: [400, 530, 875, 940],
  },
  {
    id: "digikey",
    title: "Spectrala",
    value: [458, 530, 623],
  },
];

export const defaultCalibration = calibrationPresets[3];

export const expandPreset = (preset) => {
  return {
    title: preset.title,
    value: preset.value.map((w, idx) =>
      CalibPt.construct(w, idx / preset.value.length, false)
    ),
  };
};

export const presetOfTitle = (title) =>
  calibrationPresets.find((p) => p.title === title);

export const currentCalibrationPreset = (calibrationPoints) => {
  let possiblePresets = [];
  let currentPoints = calibrationPoints.map(CalibPt.getWavelength);
  for (const calibration of calibrationPresets) {
    const sameLength = calibration.value.length === currentPoints.length;
    const samePoints = calibration.value.every((p) =>
      currentPoints.includes(p)
    );
    if (sameLength && samePoints) possiblePresets.push(calibration);
  }
  possiblePresets.push(presetOfTitle("Custom"));
  return possiblePresets[0];
};

export const currentAndOtherCalibrationPresets = (calibrationPoints) => {
  let current = currentCalibrationPreset(calibrationPoints);
  let other = calibrationPresets.filter(
    (preset) => preset.title !== current.title
  );
  return {
    current: current,
    other: other,
    all: calibrationPresets,
  };
};

// TODO: Learn what to actually do with this default export.
export default null;
