import * as fs from "expo-file-system";
import * as SessionExport from "../types/SessionExport";
import * as SpectrumExport from "../types/SpectrumExport";
import * as Sharing from "expo-sharing";

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

export const saveSessionExportLocally = async (sessionExport) => {
  const name = SessionExport.getName(sessionExport);
  const parentDir = await createUniqueParentDir(name);
  const spectrumExports = SessionExport.getSpectrumExports(sessionExport);

  const dirs = await Promise.all(
    spectrumExports.map(async (spectrumExport) => {
      const dir = parentDir + SpectrumExport.getName(spectrumExport);
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

export const shareSession = async (sessionExport) => {
  const dir = await saveSessionExportLocally(sessionExport);
  const canShare = await Sharing.isAvailableAsync();
  canShare && (await Sharing.shareAsync(dir));
};
