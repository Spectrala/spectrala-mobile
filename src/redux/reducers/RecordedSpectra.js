import { createSlice } from "@reduxjs/toolkit";
import * as Spectrum from "../../types/Spectrum";

export const spectrumSlice = createSlice({
  name: "spectra",
  initialState: {
    recordedSpectra: [],
    referenceKey: null,
    highestKey: 0,
  },
  reducers: {
    recordSpectrum: (state, action) => {
      const spectrum = action.payload.spectrum;
      state.recordedSpectra.push(spectrum);
      state.highestKey = Math.max(state.highestKey, Spectrum.getKey(spectrum));
    },
    removeSpectrum: (state, action) => {
      const idx = action.payload.targetIndex;
      state.recordedSpectra.splice(idx, 1);
    },
    updateSpectrum: (state, action) => {
      const idx = action.payload.targetIndex;
      const spectrum = action.payload.spectrum;
      state.recordedSpectra[idx] = spectrum;
    },
    removeReference: (state, action) => {
      state.referenceKey = null;
    },
    setReference: (state, action) => {
      const key = action.payload.key;
      state.referenceKey = key;
    },
  },
});

export const {
  recordSpectrum,
  removeSpectrum,
  updateSpectrum,
  removeReference,
  setReference,
} = spectrumSlice.actions;

/**
 * Get the current reference spectrum from the store
 * @param {Object} state Redux store state
 * @returns {Spectrum} the refrence spectrum
 */
export const selectReferenceIntensity = (state) => {
  const key = state.spectra.referenceKey;
  const spectra = state.spectra.recordedSpectra;
  const reference = spectra.find((s) => Spectrum.getKey(s) === key);
  return reference;
};

/**
 * Select the highest key used in a spectrum, to be used
 * for generating the next key.
 * @param {Object} state Redux store state
 * @returns {Number} the highest key used so far for a spectrum
 */
export const selectHighestKey = (state) => state.spectra.highestKey;

/**
 * Return all recorded spectra from the redux store.
 * @param {Object} state Redux store state
 * @returns {Array<Spectrum>} Array of recorded spectra
 */
export const selectRecordedSpectra = (state) => {
  return state.spectra.recordedSpectra;
};

/**
 * Return the key of the reference spectrum. If there is not a
 * current reference spectrum, returns null.
 * @param {Object} state Redux store state
 * @returns {Number | null} current referenece spectrum key
 */
export const selectReferenceKey = (state) => {
  return state.spectra.referenceKey;
};

export default spectrumSlice.reducer;
