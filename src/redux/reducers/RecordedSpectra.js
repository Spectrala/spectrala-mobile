import { createSlice } from "@reduxjs/toolkit";
import * as Spectrum from "../../types/Spectrum";

export const spectrumSlice = createSlice({
  name: "spectra",
  initialState: {
    recordedSpectra: [],
    referenceKey: null,
  },
  reducers: {
    recordSpectrum: (state, action) => {
      const spectrum = action.payload.intensityChart;
      state.recordedSpectra.push(spectrum);
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
      const idx = action.payload.targetIndex;
      const reference = state.recordedSpectra[idx];
      state.referenceKey = Spectrum.getKey(reference);
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
 * Return all recorded spectra from the redux store.
 * @param {Object} state Redux store state
 * @returns {Array<Spectrum>} Array of recorded spectra
 */
export const selectRecordedSpectra = (state) => {
  return state.spectra.recordedSpectra;
};

export default spectrumSlice.reducer;
