import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store/Store";
import * as Session from "../types/Session";
import { selectActiveEditingSession } from "../redux/reducers/Sessions";

const DEFAULT_NAME = "Session ";
const SESSION_STORAGE_KEY = "@spectrala_sessions";

/**
 * Retrieve stored sessions from the device's local storage
 * @returns Array<Session>
 */
export const getSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error(e);
  }
};

/**
 * Removes all saved sessions from local storage.
 */
export const eraseSessions = async () => {
  try {
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, "");
  } catch (e) {
    console.error(e);
  }
};

/**
 * Package the redux store into a session and store it in localstorage.
 */
const updateSessionStore = async (session, allSessions) => {
  try {
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify([...allSessions, session])
    );
  } catch (e) {
    // saving error
    console.error(e);
  }
};

/**
 * Create a new session based off of the redux store.
 * @param {Object} reduxState current redux store from store.getState()
 * @returns {Session} the new session based off of the redux store
 */
export const buildNewSession = async (reduxState) => {
  const time = Date.now();
  const { readerBox, calibration, spectra } = reduxState;
  try {
    const sessions = await getSessions();
    const greatestKey = Math.max(
      0,
      ...sessions.map((session) => parseInt(Session.getKey(session)))
    );
    const newKey = greatestKey + 1;
    const name = DEFAULT_NAME + newKey;
    const session = Session.construct(
      name,
      time,
      readerBox,
      calibration,
      spectra,
      newKey
    );
    return { sessions, session };
  } catch (e) {
    // accessing error
    console.error(e);
  }
};

/**
 * Replaces the session in local storage with the same key as the provided
 * session with the provided session. Essentially, the function removes
 * session instances of the same key from local storage and adds back
 * the updatedSession, which could have changed parameters other than key.
 *
 * If a session with the same key does not exist, it is added to the
 * existing list of sessions.
 * @param {Session} updatedSession session to update in local storage
 */
export const updateSessionWithSameKey = async (updatedSession) => {
  const sessions = await getSessions();
  const updatedSessions = sessions.filter(
    (session) => Session.getKey(session) !== Session.getKey(updatedSession)
  );
  updateSessionStore(updatedSession, updatedSessions);
};

/**
 * Extracts the current session state from the redux store, merges
 * it with the active editing session, and updates this edited session
 * in the device's local storage.
 */
export const handleSaveSession = async () => {
  const reduxState = store.store.getState();
  let { sessions: allSessions, session: currentSession } =
    await buildNewSession(reduxState);
  const editingSession = selectActiveEditingSession(reduxState);
  if (editingSession) {
    currentSession = Session.combineSessions(editingSession, currentSession);
    allSessions = allSessions.filter(
      (session) => Session.getKey(session) !== Session.getKey(editingSession)
    );
  }
  updateSessionStore(currentSession, allSessions);
};
