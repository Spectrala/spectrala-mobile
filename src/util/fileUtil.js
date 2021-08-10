import * as fs from "expo-file-system";
import * as SessionExport from "../types/SessionExport";
import * as SpectrumExport from "../types/SpectrumExport";
import * as Sharing from "expo-sharing";
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
  const parentDir = fs.cacheDirectory + uniqueParentDirName + "/";

  await fs.makeDirectoryAsync(parentDir);
  const dir = parentDir + name + "/";
  await fs.makeDirectoryAsync(dir);
  return dir;
};

export const saveSessionCSVExportLocally = async (sessionExport) => {
  const name = SessionExport.getName(sessionExport);
  const parentDir = await createUniqueParentDir(name);
  const spectrumExports = SessionExport.getSpectrumExports(sessionExport);

  const dirs = await Promise.all(
    spectrumExports.map(async (spectrumExport) => {
      const dir = parentDir + SpectrumExport.getName(spectrumExport) + ".csv";
      const csv = SpectrumExport.getCSVString(spectrumExport);
      try {
        await fs.writeAsStringAsync(dir, csv);
      } catch (e) {
        console.log(dir);
        console.error(e);
      }
      return dir;
    })
  );
  return parentDir;
};

export const shareSessionCSVFolder = async (sessionExport) => {
  const dir = await saveSessionCSVExportLocally(sessionExport);
  const canShare = await Sharing.isAvailableAsync();
  canShare && (await Sharing.shareAsync(dir));
};

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
  await fs.writeAsStringAsync(dir, workbookString, {
    encoding: fs.EncodingType.Base64,
  });
  return dir;
};

/**
 *
 * XLSX calls best documented here: https://stackoverflow.com/a/60926972
 * @param {*} sessionExport
 */
export const shareSessionXLSX = async (sessionExport) => {
  const dir = await writeSessionXLSX(sessionExport);
  const canShare = await Sharing.isAvailableAsync();
  canShare && (await Sharing.shareAsync(dir));
};
import * as MailComposer from "expo-mail-composer";

export const emailSessionXLSX = async (sessionExport) => {
  const dir = await writeSessionXLSX(sessionExport);
  const canMail = await MailComposer.isAvailableAsync();
  if (canMail) {
    await MailComposer.composeAsync({
      subject: "Spectra from mobile phone spectrometer",
      body: "Please see attached data export from Spectrala Mobile! 📈 ",
      attachments: [dir],
    });
  }
};
