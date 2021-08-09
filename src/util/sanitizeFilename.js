const BANNED_FILENAME_CHARACTER_REGEX = /[^A-Z,a-z,\d,_,-]/g;

const REPLACEMENT_CHAR = "";

/**
 * Cleans a name of a spectrum for usage as a filename.
 * Uses the sanitize filename module
 * @param {String} name a filename
 * @returns {String} the sanitized name
 */
export const sanitizeNameForFilename = (name) => {
  return name.replaceAll(BANNED_FILENAME_CHARACTER_REGEX, REPLACEMENT_CHAR);
};
