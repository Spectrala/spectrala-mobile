import * as CalibPt from "./calibration_point";
export const MINIMUM_WAVELENGTH = 300;
export const MAXIMUM_WAVELENGTH = 1000;

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
];

export const defaultCalibration = calibrationPresets[2];

export const expandPreset = (preset) => {
  return {
    title: preset.title,
    value: preset.value.map((w) => CalibPt.construct(w, null, false)),
  };
};

export const presetOfTitle = (title) =>
  calibrationPresets.filter((p) => p.title === title)[0];

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
