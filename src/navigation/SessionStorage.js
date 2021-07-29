import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store/Store";
import * as Session from "../types/Session";

const DEFAULT_NAME = "New Session ";
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

/**
 * Package the redux store into a session and store it in localstorage.
 */
export const storeCurrentSession = async () => {
  const time = new Date();
  const { readerBox, calibration, spectra } = store.store.getState();
  try {
    const sessions = await getSessions();
    let name = DEFAULT_NAME + 1;
    let newSessions = [];
    if (sessions) {
      const numSessions = sessions.length;
      name = DEFAULT_NAME + numSessions;
      newSessions = [sessions]
    }
    const session = Session.construct(
      name,
      time,
      readerBox,
      calibration,
      spectra
    );
    newSessions = [...newSessions, session]
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(newSessions)
    );
  } catch (e) {
    // saving error
    console.error(e);
  }
};
