import { createSlice } from "@reduxjs/toolkit";

/**
 * activeEditingSession {Session} the current session being edited from re-enter session
 */
export const sessionSlice = createSlice({
  name: "sessions",
  initialState: {
    activeEditingSession: null,
  },
  reducers: {
    editSession: (state, action) => {
      const session = action.payload.value;
      state.activeEditingSession = session;
    },
    escapeEditingSession: (state, action) => {
      state.activeEditingSession = null;
    },
  },
});

export const { editSession, escapeEditingSession } = sessionSlice.actions;

export const selectActiveEditingSession = (state) => {
  return state.sessions.activeEditingSession;
};

export default sessionSlice.reducer;
