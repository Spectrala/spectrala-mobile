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

/**
 * 
 * @param {Array<HeaderRelation>} headerMap
 * @param {Array<Object>} rows
 */
export const arrayToCSVString = (headerMap, rows) => {
  const headers = Object.keys(arr[0]);
  const headerRow = `${headers.join(",")}\n`;
  const bodyRows = arr.map((row) => {
    const vals = headerRow.join();
  });
};
