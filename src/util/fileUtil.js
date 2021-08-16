import {
  writeAsStringAsync as fsWriteAsStringAsync,
  EncodingType as fsEncodingType,
  cacheDirectory as fsCacheDirectory,
  makeDirectoryAsync as fsMakeDirectoryAsync,
} from "expo-file-system";
import * as SessionExport from "../types/SessionExport";
import * as SpectrumExport from "../types/SpectrumExport";
import {
  isAvailableAsync as sharingIsAvailableAsync,
  shareAsync as sharingShareAsync,
} from "expo-sharing";
import {
  isAvailableAsync as mailComposerIsAvailableAsync,
  composeAsync as mailComposerComposeAsync,
} from "expo-mail-composer";

import XLSX from "xlsx";

/**
 * Creates a new directory in the device's local cache under a unique
 * subdirectory created by the current time and a random number.
 * @param {String} name subdirectory name
 * @returns {String} path of created directory
 */
const createUniqueParentDir = async (name) => {
  const currentEpochTime = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);

  /**
   * Shorten the string version of the unique number by converting to base 36
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
   */
  const MAX_RADIX = 36;
  const uniqueParentDirName =
    currentEpochTime.toString(MAX_RADIX) + randomNumber.toString(MAX_RADIX);
  const parentDir = fsCacheDirectory + uniqueParentDirName + "/";

  await fsMakeDirectoryAsync(parentDir);
  const dir = parentDir + name + "/";
  await fsMakeDirectoryAsync(dir);
  return dir;
};

/**
 * Writes a folder of csv files, each csv representing one spectrum.
 * @param {SessionExport} sessionExport session to export data from 
 * @returns {String} the path to the folder containing all csvs.
 */
export const saveSessionCSVExportLocally = async (sessionExport) => {
  const name = SessionExport.getName(sessionExport);
  const parentDir = await createUniqueParentDir(name);
  const spectrumExports = SessionExport.getSpectrumExports(sessionExport);

  await Promise.all(
    spectrumExports.map(async (spectrumExport) => {
      const dir = parentDir + SpectrumExport.getName(spectrumExport) + ".csv";
      const csv = SpectrumExport.getCSVString(spectrumExport);
      try {
        await fsWriteAsStringAsync(dir, csv);
      } catch (e) {
        console.log(dir);
        console.error(e);
      }
      return dir;
    })
  );
  return parentDir;
};


/**
 * Prompts the native device social share menu to share a folder
 * of csv files representing recorded spectra. The fallback here is that
 * most endpoints do not allow sharing a directory, yet the native 
 * flow displays them as options anyway. Should only be used once 
 * zipping a file can be done with expo. 
 * @param {SessionExport} sessionExport session to export data from 
 */
export const shareSessionCSVFolder = async (sessionExport) => {
  const dir = await saveSessionCSVExportLocally(sessionExport);
  const canShare = await sharingIsAvailableAsync();
  canShare && (await sharingShareAsync(dir));
};

/**
 * Writes a new excel workbook based on a SessionExport to the local file system.
 * XLSX calls best documented here: https://stackoverflow.com/a/60926972
 * @param {SessionExport} sessionExport session to export data from 
 * @returns {String} the path to the new xslx file
 */
export const writeSessionXLSX = async (sessionExport) => {
  const name = SessionExport.getName(sessionExport);
  const parentDir = await createUniqueParentDir(name);
  const dir = parentDir + name + ".xlsx";
  const spectrumExports = SessionExport.getSpectrumExports(sessionExport);
  let workbook = XLSX.utils.book_new();
  spectrumExports.forEach((spectrumExport) => {
    const spectrumName = SpectrumExport.getName(spectrumExport);
    const worksheet = SpectrumExport.getExcelWorksheet(spectrumExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, spectrumName);
  });
  const workbookString = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });
  await fsWriteAsStringAsync(dir, workbookString, {
    encoding: fsEncodingType.Base64,
  });
  return dir;
};

/**
 * Prompts the native device social share menu to share an excel workbook.
 * @param {SessionExport} sessionExport session to export data from 
 */
export const shareSessionXLSX = async (sessionExport) => {
  const dir = await writeSessionXLSX(sessionExport);
  const canShare = await sharingIsAvailableAsync();
  canShare && (await sharingShareAsync(dir));
};

/**
 * Composes an email in the native mail app with spectrala data as an 
 * attachment in XSLX. 
 * @param {SessionExport} sessionExport session to export data from 
 */
export const emailSessionXLSX = async (sessionExport) => {
  const dir = await writeSessionXLSX(sessionExport);
  const canMail = await mailComposerIsAvailableAsync();
  if (canMail) {
    await mailComposerComposeAsync({
      subject: "Spectroscopic data from Spectrala Mobile",
      body: "Please see attached data export from Spectrala Mobile! 📈 ",
      attachments: [dir],
    });
  }
};
