import { createSlice } from "@reduxjs/toolkit";

/**
 * Reader box set to a width of 100, centered, and consuming 60% of
 * the screen width. Set to be aesthetically pleasing as a valid
 * default value.
 *
 * corners are a computed propert.
 */
export const DEFAULT_READER_BOX = {
  lineCoords: { lowX: 0.2, lowY: 0.5, highX: 0.8, highY: 0.5 },
  width: 100,
  corners: [
    { x: 0.2, y: 0.4320652173913043 },
    { x: 0.2, y: 0.5679347826086957 },
    { x: 0.8, y: 0.4320652173913043 },
    { x: 0.8, y: 0.5679347826086957 },
  ],
  angle: 0,
  isFlipped: false,
  cornersAreValid: true,
  rowPct: 0.5,
};

export const readerBoxSlice = createSlice({
  name: "readerBox",
  initialState: DEFAULT_READER_BOX,
  reducers: {
    updateReaderBoxData: (state, action) => {
      const { lineCoords, corners, angle, cornersAreValid } =
        action.payload.value;
      state.lineCoords = lineCoords;
      state.corners = corners;
      state.angle = angle;
      state.cornersAreValid = cornersAreValid;
    },
    updateReaderWidth: (state, action) => {
      state.width = action.payload.value;
    },
    toggleIsFlipped: (state, action) => {
      state.isFlipped = !state.isFlipped;
    },
    restoreBox: (state, action) => {
      const { lineCoords, width, corners, angle, isFlipped, cornersAreValid, rowPct } =
        action.payload.value;
      state.lineCoords = lineCoords;
      state.width = width;
      state.corners = corners;
      state.angle = angle;
      state.isFlipped = isFlipped;
      state.cornersAreValid = cornersAreValid;
      state.rowPct = rowPct;
    },
    setRowPct: (state, action) => {
      state.rowPct = action.payload.value;
    },
  },
});

export const {
  updateReaderBoxData,
  updateReaderWidth,
  toggleIsFlipped,
  restoreBox,
  setRowPct,
} = readerBoxSlice.actions;

export const selectLineCoords = (state) => state.readerBox.lineCoords;

export const selectCorners = (state) => state.readerBox.corners;

export const selectReaderWidth = (state) => state.readerBox.width;

export const selectCornersAreValid = (state) => state.readerBox.cornersAreValid;

export const selectRowPct = (state) => {
  return state.readerBox.rowPct;
};

export default readerBoxSlice.reducer;
