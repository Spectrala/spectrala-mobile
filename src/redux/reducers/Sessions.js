import { createSlice } from "@reduxjs/toolkit";

/**
 * activeEditingSession {Session} the current session being edited from re-enter session
 */
export const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    activeEditingSession: null,
    showsRecalibrateHint: false,
  },
  reducers: {
    editSession: (state, action) => {
      const session = action.payload.value;
      state.activeEditingSession = session;
      state.showsRecalibrateHint = true;
    },
    escapeEditingSession: (state, action) => {
      state.activeEditingSession = null;
      state.showsRecalibrateHint = false;
    },
    dismissRecalibrateHint: (state, action) => {
      state.showsRecalibrateHint = false;
    },
  },
});

export const { editSession, escapeEditingSession, dismissRecalibrateHint } = sessionsSlice.actions;

export const selectActiveEditingSession = (state) => {
  return state.sessions.activeEditingSession;
};

export const selectShowsRecalibrateHint = (state) => {
  return state.sessions.showsRecalibrateHint;
};

export default sessionsSlice.reducer;
