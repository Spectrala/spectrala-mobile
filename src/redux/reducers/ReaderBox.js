import { createSlice } from "@reduxjs/toolkit";

export const readerBoxSlice = createSlice({
  name: "readerBox",
  initialState: {
    lineCoords: { lowX: 0.2, lowY: 0.5, highX: 0.8, highY: 0.5 },
    width: 100,
    corners: [
      { x: 0.2, y: 0.4320652173913043 },
      { x: 0.2, y: 0.5679347826086957 },
      { x: 0.8, y: 0.4320652173913043 },
      { x: 0.8, y: 0.5679347826086957 },
    ],
    angle: 0,
    isFlipped: true,
  },
  reducers: {
    updateReaderBoxData: (state, action) => {
      state = { ...state, ...action.payload.value };
    },
    updateReaderWidth: (state, action) => {
      state.width = action.payload.value;
    },
    toggleIsFlipped: (state, action) => {
      state.isFlipped = !state.isFlipped;
    },
  },
});

export const { updateReaderBoxData, updateReaderWidth, toggleIsFlipped } =
  readerBoxSlice.actions;

export const selectLineCoords = (state) => state.readerBox.lineCoords;

export const selectCorners = (state) => state.readerBox.corners;

export const selectAngle = (state) => state.readerBox.angle;

export const selectReaderWidth = (state) => state.readerBox.width;

export const selectReaderLength = (state) => state.readerBox.length;

export const selectIsFlipped = (state) => state.readerBox.isFlipped;

export default readerBoxSlice.reducer;
