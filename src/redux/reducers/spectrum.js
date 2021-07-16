import { createSlice } from "@reduxjs/toolkit";
import { selectUncalibratedIntensities } from "./SpectrumFeed";
import { getCalibratedIntensities } from "../../util/spectroscopyMath";

// Default name prefix for saving a spectrum. Will start naming as DEFAULT_NAME 1.
const DEFAULT_NAME = "New Spectrum ";

/**
 * addNewSpectrum
 *      Adds a new spectrum to the list of stored spectra.
 *
 *      Returns: (array) -- the array of recorded spectra.
 *      Format:
 *      [{
 *          key: 2
 *          name: "Water"
 *          intensity: [{x: 338.3, y: 44.2}]
 *      }]
 * @param {array} currentArray - the current array of recorded spectra
 * @param {array} intensity - the intensitiy data to record in the recorded spectra array
 */
const addNewSpectrum = (currentArray, intensity) => {
  let key = Math.max(...currentArray.map((r) => r.key)) + 1;
  const name = defaultName + key;
  currentArray.push({ key, name, intensity });
  return currentArray;
};

export const spectrumSlice = createSlice({
  name: "spectra",
  initialState: {
    spectrum: null,
    recorded_spectra: [],
    key_being_used: null,
  },
  reducers: {
    recordSpectrum: (state, action) => {
      // TODO: Verify spectrum is okay. Right now that is only done in the button.
      const key = action.payload.data;
      const refs = state.recorded_spectra;
      const recorded = addNewSpectrum(refs, data);

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
      state.recorded_spectra = setIsReferenceFalse(state.recorded_spectra);
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
 * selectReferenceIntensity
 *      Get the intensity values of the reference spectrum used for creating a resultant spectrum.
 *      This will be what the user has selected.
 *
 *      Returns: array. Looks like this: [{x: 338.3, y: 44.2}].
 */
export const selectReferenceIntensity = (state) => {
  const reference = state.spectra.recorded_spectra.filter((s) => s.isReference);
  if (reference.length === 0) {
    return null;
  }
  return reference[0].data;
};

// TODO: make this look professional
// get nearest neighbor (in x position) to a parent x value of neighborArray and return the neighborArray y value.
const getNeighborY = (parentX, neighborArray) => {
  if (!neighborArray) {
    console.error("Tried to compute neighbor Y of a null array");
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
