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
export const generateCSVString = (headerRelations, rows) => {
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

