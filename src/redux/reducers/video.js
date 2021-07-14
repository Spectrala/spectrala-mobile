import { createSlice } from "@reduxjs/toolkit";

export const SourceEnum = {
  STREAM: "SOURCE_STREAM",
  WEBCAM: "SOURCE_WEBCAM",
  IMAGE: "SOURCE_IMAGE",
  MOBILE_STREAM: "SOURCE_MOBILE_STREAM",
};

// Samples included in the moving average
const PIXEL_LINE_HISTORY_DEPTH = 5;

// Look for absolute maximum, and don't do this in video. this should be raw input.
const OVERSATURATION_CEILING = 98;
const isNotOversaturated = (val) => val < OVERSATURATION_CEILING;

/**
 * readerBoxData:
 *  lineCoords: object with coordinates for low energy and high energy dots on the reader line.
 *              the units for coordinates is the fraction of the view's width/height (from 0 to 1)
 *  corners: coordinates (in no particular order) of the verticies of the rectangle of the reader box
 *  angle: angle, in degrees, the line between the two points makes with the horizontal axis
 */

/**
 * videoSlice variables
 *
 * The variable we care about here the most is pixelLine, which is an array
 * of objects representing each pixel along the line defined by the user.
 * The pixel line is of the form [{r: 233.0, g: 30.2, b: 2.9, a: 1.0 }, ...]
 *
 * Selectors can choose how they export this data to something more useful for other classes.
 */
export const videoSlice = createSlice({
  name: "video",
  initialState: {
    pixelLineHistory: [],
    isOversaturated: false,
    readerBoxData: {
      lineCoords: { lowX: 0.2, lowY: 0.5, highX: 0.8, highY: 0.5 },
      width: 100,
      corners: [
        { x: 0.20000000000000004, y: 0.4320652173913043 },
        { x: 0.20000000000000004, y: 0.5679347826086957 },
        { x: 0.8000000000000002, y: 0.4320652173913043 },
        { x: 0.8000000000000002, y: 0.5679347826086957 },
      ],
      angle: 0,
    },
    selectedSource: SourceEnum.WEBCAM,
    uploadedImage: undefined,
    selectedWebcam: undefined,
    previewImage: undefined,
  },
  reducers: {
    updateReaderBoxData: (state, action) => {
      state.readerBoxData = { ...state.readerBoxData, ...action.payload.value };
    },
    updateReaderWidth: (state, action) => {
      state.readerBoxData = {
        ...state.readerBoxData,
        width: action.payload.value,
      };
    },
    setSelectedSource: (state, action) => {
      state.selectedSource = action.payload.value;
      state.selectedWebcam = action.payload.webcam;
    },
    setUploadedImage: (state, action) => {
      // Done because going to data upload makes image blank.
      state.uploadedImage = action.payload.image;
    },
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

      /**
       * Detect oversaturation
       */
      state.isOversaturated = !newLine.every(isNotOversaturated);
    },
    setPreviewImage: (state, action) => {
      state.previewImage = action.payload.value;
    },
  },
});

export const {
  updateFeed,
  updateReaderBoxData,
  setSelectedSource,
  setUploadedImage,
  updateReaderWidth,
  setPreviewImage,
} = videoSlice.actions;

export const selectUploadedImage = (state) => state.video.uploadedImage;

export const selectIntensities = (state) => {
  const pixels = state.video.pixelLineHistory;
  if (pixels && pixels.length > 0) {
    const pixelLines = pixels;
    // const pixelLines = pixels.map((line) =>
    //   line.map((obj) => (obj.r + obj.g + obj.b) / 3 / 2.55)
    // );
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

export const selectSource = (state) => state.video.selectedSource;

export const selectWebcam = (state) => state.video.selectedWebcam;

export const selectOversaturation = (state) => state.video.isOversaturated;

export const selectLineCoords = (state) => state.video.readerBoxData.lineCoords;

export const selectCorners = (state) => state.video.readerBoxData.corners;

export const selectAngle = (state) => state.video.readerBoxData.angle;

export const selectReaderWidth = (state) => state.video.readerBoxData.width;

export const selectReaderLength = (state) => state.video.readerBoxData.length;

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

export const selectPreviewImg = (state) => state.video.previewImage;

export default videoSlice.reducer;
