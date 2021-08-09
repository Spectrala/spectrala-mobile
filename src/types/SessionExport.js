/**
 * This module deals with objects in the following form:
 *
 * {
 *  name: String,
 *  spectra: Array<SpectrumExport>,
 * }
 *
 * This represents a single session most often containing
 * recorded spectra. The name of a SessionExport can be used
 * as a folder name containing csv files for each session.
 */

import * as Session from "./Session";
import * as SpectrumExport from "./SpectrumExport";
import { sanitizeNameForFilename } from "../util/csvUtil";

/**
 * Creates an object representing a spectrala session based on a name
 * for the session and the decoded session data from local storage.
 * @param {String} name user's name for the session
 * @param {Object} session recorded spectrala session from local storage
 * @returns {SessionExport} 
 */
export const construct = (name, session) => {
  const reference = Session.getReferenceSpectrum(session);
  const spectra = Session.getSpectraList(session).map((spectrum) =>
    SpectrumExport.construct(spectrum, reference)
  );
  const exportName = sanitizeNameForFilename(name);
  return {
    name: exportName,
    spectra,
  };
};
