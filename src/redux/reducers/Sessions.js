import { createSlice } from "@reduxjs/toolkit";

/**
 * activeEditingSession {Session} the current session being edited from re-enter session
 * showsRecalibrateHint {bool} true if the "Press to calibrate" hint in capture is to be shown
 */
export const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    activeEditingSession: null,
    showsRecalibrateHint: false,
    showsOnExitToast: false,
  },
  reducers: {
    editSession: (state, action) => {
      const session = action.payload.value;
      state.activeEditingSession = session;
      state.showsRecalibrateHint = true;
    },
    endEditingSession: (state, action) => {
      state.activeEditingSession = null;
      state.showsRecalibrateHint = false;
    },
    dismissRecalibrateHint: (state, action) => {
      state.showsRecalibrateHint = false;
    },
    setShowsOnExitToast: (state, action) => {
      state.showsOnExitToast = action.payload.value;
    }
  },
});

export const { editSession, endEditingSession, dismissRecalibrateHint, setShowsOnExitToast } = sessionsSlice.actions;

export const selectActiveEditingSession = (state) => {
  return state.sessions.activeEditingSession;
};

export const selectShowsRecalibrateHint = (state) => {
  return state.sessions.showsRecalibrateHint;
};

export const selectShowsOnExitToast = (state) => {
  return state.sessions.showsOnExitToast;
}

export default sessionsSlice.reducer;
