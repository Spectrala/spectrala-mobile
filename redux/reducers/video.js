import { createSlice } from "@reduxjs/toolkit";
const convert = require("color-convert");

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
 * Function used to extract intensity from any given pixel
 * during reading an image from the box.
 *
 * Takes r,g,b from (0,255) and returns an intensity from 0-100.
 *
 * @param {number} r red value from 0 to 255
 * @param {number} g green value from 0 to 255
 * @param {number} b blue value from 0 to 255
 * @returns {number} intensity
 */
const rgbToIntensity = (r, g, b) => {
  // Take brightness to be "value" in HSV color space, 0-100.
  const hsv = convert.rgb.hsv.raw(r, g, b);
  // Indicies described: https://github.com/Qix-/color-convert/blob/HEAD/conversions.js
  const value = hsv[2];
  return value;
};

/**
 * Function to map a 2d reader box to a 1d reader line. Each
 * line perpendicular to the reader line (between the two dots)
 * and is represented by a 1d array of intensities (from rgbToIntensity).
 * 
 * @param {array} intensities array of intensities from rgbToIntensity
 * @returns {number} single intensity value from the given horizontal.
 */
const reduceHorizontal = (intensities) => {
  // Return the maximum intensity, given this intensity is not exactly 100.
  if (intensities.length == 0) return 0;
  const noExtremes = intensities.filter((i) => i < 100);
  if (noExtremes.length == 0) {
    console.log("Issue: All of a horizontal were extreme values (intensity of 100).")
    return intensities[0];
  }
  return Math.max(...noExtremes);
};

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
      lineCoords: {
        lowX: 0.2,
        lowY: 0.5,
        highX: 0.8,
        highY: 0.5,
      },
      corners: undefined,
      angle: undefined,
      secondCropBox: undefined,
    },
    selectedSource: SourceEnum.WEBCAM,
    uploadedImage: undefined,
    selectedWebcam: undefined,
  },
  reducers: {
    updateFeed: (state, action) => {
      const { imageData, width } = action.payload;

      // imageData is a 1-d array of [r, g, b, a, r, g, b, a, ...].

      const newline = [];

      const horizontalProcessingFunc = (horizontal) => {
        const intensities = [];
        // Each pixel is r, g, b, a
        for (let j = 0; j < horizontal.length; j += 4) {
          const chunk = horizontal.slice(j, j + 4);
          const r = chunk[0];
          const g = chunk[1];
          const b = chunk[2];
          const intensity = rgbToIntensity(r, g, b);
          intensities.push(intensity);
        }
        return reduceHorizontal(intensities);
      };

      for (let i = 0; i < imageData.length; i += 4 * width) {
        const chunk = imageData.slice(i, i + 4 * width);
        newline.push(horizontalProcessingFunc(chunk));
      }

      let lineHist = state.pixelLineHistory;
      /**
       * This maintains a history of a certain length
       * of pixel values in order to create a moving average of intensities.
       * There's obvious uncertainty when looking at the static bounce around.
       * Smoothing this out is better for UX and scientific accuracy.
       */
      if (lineHist.length > 0) {
        if (lineHist[0].length === newline.length) {
          if (lineHist.length >= PIXEL_LINE_HISTORY_DEPTH)
            lineHist = lineHist.slice(
              PIXEL_LINE_HISTORY_DEPTH - lineHist.length + 1
            );
          lineHist.push(newline);
        } else {
          lineHist = [newline];
        }
      } else {
        lineHist = [newline];
      }
      state.pixelLineHistory = lineHist;

      /**
       * Detect oversaturation
       */
      state.isOversaturated = !newline.every(isNotOversaturated);
    },
    updateReaderBoxData: (state, action) => {
      state.readerBoxData = action.payload.value;
    },
    setSelectedSource: (state, action) => {
      state.selectedSource = action.payload.value;
      state.selectedWebcam = action.payload.webcam;
    },
    setUploadedImage: (state, action) => {
      // Done because going to data upload makes image blank.
      state.uploadedImage = action.payload.image;
    },
  },
});

export const {
  updateFeed,
  updateReaderBoxData,
  setSelectedSource,
  setUploadedImage,
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

export const selectSecondCropBox = (state) =>
  state.video.readerBoxData.secondCropBox;

export const selectChartData = (state) => {
  const intensities = selectIntensities(state);
  if (!intensities) {
    return null;
  }
  return [
    {
      id: "spectrum",
      color: "#00873E",
      data: intensities.map((y, idx) => {
        return {
          x: idx / (intensities.length - 1),
          y: y,
        };
      }),
    },
  ];
};

export default videoSlice.reducer;
