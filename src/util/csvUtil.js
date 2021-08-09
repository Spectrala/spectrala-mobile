/**
 * Constructs an object in the expected format for the headerMap in arrayToCSVString.
 * @param {String} objectDataKey
 * @param {String} csvColumnHeader
 * @returns HeaderRelation
 */
export const constructHeaderRelation = (objectDataKey, csvColumnHeader) => ({
  objectDataKey,
  csvColumnHeader,
});

const arrToCSVRow = (arr) => `${arr.join(",")}\n`;

/**
 *
 * @param {Array<HeaderRelation>} headerRelations
 * @param {Array<Object>} rows
 */
export const getCSVString = (headerRelations, rows) => {
  const displayHeaders = headerRelations.map((r) => r.csvColumnHeader);
  const headerRowString = arrToCSVRow(displayHeaders);

  const dataHeaders = headerRelations.map((r) => r.objectDataKey);
  const bodyRows = rows.map((rowDictionary) => {
    const rowValues = dataHeaders.map(
      (objectDataKey) => rowDictionary[objectDataKey]
    );
    return arrToCSVRow(rowValues);
  });
  const bodyString = bodyRows.join("");

  const csvString = headerRowString + bodyString;
  return csvString;
};


/**
 * Cleans a name of a spectrum for usage as a filename.
 * Replaces all spaces in a string with underscores.
 * @param {String} name a filename
 * @returns {String} the sanitized name
 */
 export const sanitizeNameForFilename = (name) => {
  return name.replace(" ", "_");
};