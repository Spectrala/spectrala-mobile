/**
 * This module deals with objects in the following form:
 *
 * {
 *  objectDataKey: String,
 *  sheetColumnHeader: String,
 * }
 *
 * This provides a structure for creating a reference for transcribing sensible
 * object keys to exportable header strings.
 *
 */

/**
 * Constructs an object in the expected format for the headerMap in arrayToCSVString.
 * @param {String} objectDataKey
 * @param {String} sheetColumnHeader
 * @returns {HeaderRelation}
 */
export const construct = (objectDataKey, sheetColumnHeader) => ({
  objectDataKey,
  sheetColumnHeader,
});

/**
 * Get the object data key of the header relation. This represents
 * the key in a data object, not to be seen in an exported spreadsheet.
 * @param {HeaderRelation} headerRelation
 * @returns {String}
 */
export const getObjectDataKey = (headerRelation) => {
  return headerRelation.objectDataKey;
};

/**
 * Get the sheet column header of the header relation. This represents
 * the string seen in the first row of an exported spreadsheet.
 * @param {HeaderRelation} headerRelation
 * @returns {String}
 */
export const getSheetColumnHeader = (headerRelation) => {
  return headerRelation.sheetColumnHeader;
};
