const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("../logger");

const {
  fetchAndSaveClassInfo,
  extractClassStoreageURL,
} = require("../fetchers/classInfoFetcher");
const { fetchAndSaveMapData } = require("../fetchers/classStorageFetcher");
const { createStatusFile } = require("../services/jsonService");

//TODO: Loop here over all the links.

downloadJSON(
  1089654,
  //"https://www.livelox.com/Viewer/GR26-bonus-Diamond-Calar-Alto-Almeria-/GR26-bonus?classId=1091602",

  "//www.livelox.com/Viewer/GR26-03-Interval-6x1k-(unforked)---Las-Mimbres/GR26-03-livelox?classId=1089654&live=false&tab=player",
);

async function downloadJSON(classID, eventURI) {
  try {
    if (eventExists(classID))
      return logger.log("Event allready excists: Skipping");
    makeDirectory(classID);

    await fetchAndSaveClassInfo(classID, eventURI);

    const classStorageURL = extractClassStoreageURL(classID);
    if (!linkExcists(classID, eventURI)) return;

    await fetchAndSaveMapData(classID, classStorageURL);
    createStatusFile(classID, "Success");
    logger.log("Successfully downloaded the JSON files for classID", classID);
  } catch (err) {
    logger.error(
      "Was not able to downlaod JSON data for classID ",
      classID,
      " Skipping...",
    );
    logger.error(err);
  }
}

function eventExists(classID) {
  return fs.existsSync(config.JSON_FOLDER(classID));
}

function makeDirectory(classID) {
  fs.mkdirSync(config.JSON_FOLDER(classID), { recursive: true });
}

function linkExcists(classID, classStorageURL) {
  if (classStorageURL === undefined) {
    logger.warn(classID, " is probably passwordprotected. Cannot download.");
    createStatusFile(classID, "PASSWORD");
    return false;
  }
  return true;
}

module.exports = downloadJSON;
