import { createSlice } from "@reduxjs/toolkit";
import { getUncalibratedIntensities } from "../../util/spectroscopyMath";

// Samples included in the moving average
const PIXEL_LINE_HISTORY_DEPTH = 5;

// Look for absolute maximum, and don't do this in video. this should be raw input.
const OVERSATURATION_CEILING = 98;
export const isNotOversaturated = (val) => val < OVERSATURATION_CEILING;

/**
 * State variables:
 * previewImage {String} base64 JPEG of readerBox with pre-appended MIME type
 * intensityArrayHistory {Array<Array<Number>>} running history of intensity arrays
 * uncalibratedIntensities {Array<UncalibratedIntensity>} intensity array with x values
 */
export const spectrumFeedSlice = createSlice({
  name: "spectrumFeed",
  initialState: {
    previewImage: undefined,
    intensityArrayHistory: [],
    uncalibratedIntensities: undefined,
  },
  reducers: {
    updateFeed: (state, action) => {
      const previewImage = action.payload.previewUri;
      state.previewImage = previewImage;
      const newLine = action.payload.intensities;
      let lineHist = state.intensityArrayHistory;

      /**
       * This maintains a history of a certain length
       * of pixel values in order to create a moving average of intensities.
       * There's obvious uncertainty when looking at the static bounce around.
       * Smoothing this out is better for UX and scientific accuracy.
       */
      if (lineHist.length > 0 && lineHist[0].length === newLine.length) {
        if (lineHist.length >= PIXEL_LINE_HISTORY_DEPTH)
          // Remove the first element of line hisotry
          lineHist = lineHist.slice(
            PIXEL_LINE_HISTORY_DEPTH - lineHist.length + 1
          );
        // Add the most recent line ot the end of the history array
        lineHist.push(newLine);
      } else {
        // If there is a size mismatch or no line history, restart history.
        lineHist = [newLine];
      }
      state.intensityArrayHistory = lineHist;
      state.uncalibratedIntensities = getUncalibratedIntensities(lineHist);
    },
    setPreviewImage: (state, action) => {
      state.previewImage = action.payload.value;
    },
  },
});

export const { updateFeed, setPreviewImage } = spectrumFeedSlice.actions;

export const selectPreviewImg = (state) => state.spectrumFeed.previewImage;

export const selectUncalibratedIntensities = (state) =>
  state.spectrumFeed.uncalibratedIntensities;

export default spectrumFeedSlice.reducer;
