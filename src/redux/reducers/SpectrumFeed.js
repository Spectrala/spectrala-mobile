import { createSlice } from "@reduxjs/toolkit";

// Samples included in the moving average
const PIXEL_LINE_HISTORY_DEPTH = 5;

// Look for absolute maximum, and don't do this in video. this should be raw input.
const OVERSATURATION_CEILING = 98;
export const isNotOversaturated = (val) => val < OVERSATURATION_CEILING;

export const spectrumFeedSlice = createSlice({
  name: "spectrumFeed",
  initialState: {
    previewImage: undefined,
    pixelLineHistory: [],
  },
  reducers: {
    updateFeed: (state, action) => {
      const previewImage = action.payload.previewUri;
      state.previewImage = previewImage;
      const newLine = action.payload.intensities;
      let lineHist = state.pixelLineHistory;

      /**
       * This maintains a history of a certain length
       * of pixel values in order to create a moving average of intensities.
       * There's obvious uncertainty when looking at the static bounce around.
       * Smoothing this out is better for UX and scientific accuracy.
       */
      if (lineHist.length > 0 && lineHist[0].length === newLine.length) {
        if (lineHist.length >= PIXEL_LINE_HISTORY_DEPTH)
          lineHist = lineHist.slice(
            PIXEL_LINE_HISTORY_DEPTH - lineHist.length + 1
          );
        lineHist.push(newLine);
      } else {
        lineHist = [newLine];
      }
      state.pixelLineHistory = lineHist;
    },
    setPreviewImage: (state, action) => {
      state.previewImage = action.payload.value;
    },
  },
});

export const { updateFeed, setPreviewImage } = spectrumFeedSlice.actions;

export const selectIntensities = (state) => {
  const pixels = state.spectrumFeed.pixelLineHistory;
  if (pixels && pixels.length > 0) {
    const pixelLines = pixels;

    var averagedLine = [];
    const len = pixelLines[0].length;

    for (var i = 0; i < len; i++) {
      let column = [];
      for (var j = 0; j < pixelLines.length; j++) {
        column.push(pixelLines[j][i]);
      }

      averagedLine.push(column.reduce((a, b) => a + b, 0) / pixelLines.length);
    }
    return averagedLine;
  }
  return null;
};

export const selectChartData = (state) => {
  const intensities = selectIntensities(state);
  if (!intensities) {
    return null;
  }
  return intensities.map((y, idx) => {
    return {
      x: idx / (intensities.length - 1),
      y: y,
    };
  });
};

export const selectPreviewImg = (state) => state.spectrumFeed.previewImage;

export default spectrumFeedSlice.reducer;
