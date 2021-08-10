import * as HeaderRelation from "../types/HeaderRelation";
import XLSX from "xlsx";

/**
 * Generate a 2d array table from a dictionary to map object keys
 * to the displayed header text and an array of rows with the correct
 * data keys and rows of data.
 *
 * For example: Header relations
 * [
 *  {objectDataKey: "a", sheetColumnHeader: "Apple"},
 *  {objectDataKey: "o", sheetColumnHeader: "Orange"}
 * ]
 * and Rows
 * [
 *  {a: 4, o: 5},
 *  {a: 8, o: 10},
 *  {a: 12, o: 15}
 * ]
 *
 * The following array will be produced:
 * [
 *  ["Apple","Orange"],
 *  [4,5],
 *  [8,10],
 *  [12,15]
 * ]
 *
 * @param {Array<HeaderRelation>} headerRelations dictionary to assign headers
 * @param {Array<Object>} rows data objects with objectDataKey keys
 * @returns {Array<Array<any>>} 2D array representing table
 */
export const get2DArraySheetData = (headerRelations, rows) => {
  const displayHeaders = headerRelations.map((r) =>
    HeaderRelation.getSheetColumnHeader(r)
  );
  const dataHeaders = headerRelations.map((r) =>
    HeaderRelation.getObjectDataKey(r)
  );
  const bodyRows = rows.map((rowDictionary) => {
    const rowValues = dataHeaders.map(
      (objectDataKey) => rowDictionary[objectDataKey]
    );
    return rowValues;
  });
  const sheetRows = [displayHeaders, ...bodyRows];
  return sheetRows;
};

/**
 * Encode a CSV with a dictionary to map object keys to the displayed header text
 * and an array of rows with the correct data keys and rows of data.
 * Uses get2DArraySheetData. Example output:
 * "Apple,Orange
 * 4,5
 * 8,10
 * 12,15
 * "
 *
 * @param {Array<HeaderRelation>} headerRelations dictionary to assign headers
 * @param {Array<Object>} rows data objects with objectDataKey keys
 * @returns {String} rows encoded as a CSV with headers defined in headerRelations
 */
export const generateCSVString = (headerRelations, rows) => {
  const table = get2DArraySheetData(headerRelations, rows);
  const rowsAsStrings = table.map((row) => `${row.join(",")}\n`);
  const csv = rowsAsStrings.join("");
  return csv;
};

/**
 * Encode an excel worksheet with a dictionary to map object keys to the displayed header text
 * and an array of rows with the correct data keys and rows of data.
 *
 * @param {Array<HeaderRelation>} headerRelations dictionary to assign headers
 * @param {Array<Object>} rows data objects with objectDataKey keys
 * @returns {String} rows encoded as an excel worksheet
 */
export const generateXSLXWorksheet = (headerRelations, rows) => {
  const aoa = get2DArraySheetData(headerRelations, rows);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  return ws;
};
