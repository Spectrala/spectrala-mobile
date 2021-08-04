import { createSlice } from "@reduxjs/toolkit";
import * as Spectrum from "../../types/Spectrum";

export const spectrumSlice = createSlice({
  name: "spectra",
  initialState: {
    recordedSpectra: {},
    referenceKey: null,
    highestKey: 0,
  },
  reducers: {
    recordSpectrum: (state, action) => {
      const spectrum = action.payload.spectrum;
      state.recordedSpectra[Spectrum.getKey(spectrum)] = spectrum;
      state.highestKey = Math.max(state.highestKey, Spectrum.getKey(spectrum));
    },
    removeSpectrum: (state, action) => {
      const spectrum = action.payload.spectrum;
      const key = Spectrum.getKey(spectrum);
      delete state.recordedSpectra[key];
    },
    updateSpectrum: (state, action) => {
      const spectrum = action.payload.spectrum;
      const key = Spectrum.getKey(spectrum);
      state.recordedSpectra[key] = spectrum;
    },
    removeReference: (state, action) => {
      state.referenceKey = null;
    },
    setReference: (state, action) => {
      const spectrum = action.payload.spectrum;
      state.referenceKey = Spectrum.getKey(spectrum);
    },
    restoreSpectra: (state, action) => {
      const { recordedSpectra, referenceKey, highestKey } = action.payload.value;
      state.recordedSpectra = recordedSpectra;
      state.referenceKey = referenceKey;
      state.highestKey = highestKey;
    }
  },
});

export const {
  recordSpectrum,
  removeSpectrum,
  updateSpectrum,
  removeReference,
  setReference,
  restoreSpectra,
} = spectrumSlice.actions;

/**
 * Get the current reference spectrum from the store
 * @param {Object} state Redux store state
 * @returns {Spectrum | null} the refrence spectrum
 */
export const selectReferenceSpectrum = (state) => {
  const key = state.spectra.referenceKey;
  const spectra = state.spectra.recordedSpectra;
  const reference = spectra[key];
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
 * Return all recorded spectra from the redux store placed
 * into an array by reverse chronological order.
 * @param {Object} state Redux store state
 * @returns {Array<Spectrum>} Array of recorded spectra
 */
export const selectRecordedSpectra = (state) => {
  const spectra = state.spectra.recordedSpectra;
  const arr = Object.values(spectra);
  arr.sort((a, b) => Spectrum.getKey(b) - Spectrum.getKey(a));
  return arr;
};

export default spectrumSlice.reducer;
