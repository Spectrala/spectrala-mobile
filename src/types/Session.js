/**
 * Session:
 *
 * This module works with objects in the form
 * {
 *  name: String,
 *  lastEdited: Number,
 *  created: Number,
 *  readerBox: Object (from redux slice),
 *  calibration: Object (from redux slice),
 *  spectra: Object (from redux slice)
 * }
 *
 * These represent the state a spectrum-capturing session and can be used to
 * completely restore state from one of these sessions.
 *
 * Dates must be stored as milliseconds since 1970 to be serializable.
 */

/**
 * Constructs a Session
 * @param {String} name Session title
 * @param {Number} created Unix time the session was first saved
 * @param {Object} readerBox State from redux regarding placement of the box
 * @param {Object} calibration State from redux regarding placement of calibration points
 * @param {Object} spectra State from redux regarding recorded spectra
 * @returns Session
 */
export const construct = (name, created, readerBox, calibration, spectra) => ({
  name,
  lastEdited: created,
  created,
  readerBox,
  calibration,
  spectra,
});

export const getName = (session) => session.name;
export const getCreatedDateUnix = (session) => session.created;
export const getLastEditDateUnix = (session) => session.lastEdited;
export const getReduxReaderBox = (session) => session.readerBox;
export const getReduxCalibration = (session) => session.calibration;
export const getReduxSpectra = (session) => session.spectra;
export const getSpectraList = (session) => {
  // Object with keys 1, 2, ... and values Array<ChartPoint>
  const spectra = getReduxSpectra(session).recordedSpectra;
  const spectraList = Object.values(spectra);
  return spectraList;
};
