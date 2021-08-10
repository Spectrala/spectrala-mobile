import { createSlice } from "@reduxjs/toolkit";

/**
 * activeEditingSession {Session} the current session being edited from re-enter session
 * showsRecalibrateHint {bool} true if the "Press to calibrate" toast in capture is to be shown
 * showsOnExitToast {bool} true if the "Are you sure you want to exit" toast in capture is to be shown
 * sessionStoreNameEditNumber {Number} meaningless digit that updates to trigger state changes in sessions
 */
export const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    activeEditingSession: null,
    showsRecalibrateHint: false,
    showsOnExitToast: false,
    sessionStoreNameEditNumber: 0,
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
    },
    updateSessionStoreNameEditNumber: (state, action) => {
      state.sessionStoreNameEditNumber =
        (state.sessionStoreNameEditNumber + 1) % 9;
    },
  },
});

export const {
  editSession,
  endEditingSession,
  dismissRecalibrateHint,
  setShowsOnExitToast,
  updateSessionStoreNameEditNumber,
} = sessionsSlice.actions;

export const selectActiveEditingSession = (state) => {
  return state.sessions.activeEditingSession;
};

export const selectShowsRecalibrateHint = (state) => {
  return state.sessions.showsRecalibrateHint;
};

export const selectShowsOnExitToast = (state) => {
  return state.sessions.showsOnExitToast;
};

export const selectSessionStoreNameEditNumber = (state) => {
  return state.sessions.sessionStoreNameEditNumber;
};

export default sessionsSlice.reducer;
