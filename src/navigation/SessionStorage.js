import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store/Store";
import * as Session from "../types/Session";

const DEFAULT_NAME = "Session ";
const SESSION_STORAGE_KEY = "@spectrala_sessions";

/**
 * Retrieve stored sessions from the device's local storage
 * @returns Array<Session>
 */
export const getSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

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
export const storeSession = async (session, allSessions) => {
  try {
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...allSessions, ...session })
    );
  } catch (e) {
    // saving error
    console.error(e);
  }
};

export const buildNewSession = async () => {
  const time = Date.now();
  const { readerBox, calibration, spectra } = store.store.getState();
  try {
    const sessions = await getSessions();
    const greatestKey = Math.max(
      0,
      ...Object.keys(sessions).map((k) => parseInt(k))
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
    return session;
  } catch (e) {
    // accessing error
    console.error(e);
  }
};

export const combineSessions = async (oldSession, newSession) => {
  return Session.construct(
    Session.getName(oldSession),
    Session.getCreatedDateUnix(oldSession), 
    Session.getReduxReaderBox(newSession),
    Session.getReduxCalibration(newSession),
    Session.getReduxSpectra(newSession),
    Session.getKey(oldSession)
  );
};
