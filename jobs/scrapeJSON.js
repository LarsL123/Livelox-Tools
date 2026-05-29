import { error } from "console";
import logger from "../logger";
import { upgrade } from "undici-types";

const fs = require("fs");
const path = require("path");
const config = require("../config");

const {
  fetchAndSaveClassInfo,
  extractClassStoreageURL,
} = require("../fetchers/classInfoFetcher");
const { fetchAndSaveMapData } = require("../fetchers/classStorageFetcher");

//TODO: Loop here over all the links.

async function downloadJSON(classId, eventURI) {
  try {
    if (eventExists(classId)) {
      return;
    }

    makeDirectory(classId);

    await fetchAndSaveClassInfo(classId, eventURI);
    const classStorageURL = extractClassStoreageURL(classId);
    await fetchAndSaveMapData(classId, classStorageURL);
    writeStatus(classId);
    logger.log("Successfully downloaded the JSON files for classID", classId);
  } catch (Error) {
    logger.Error(
      "Was not able to downlaod JSON data for classID ",
      classId,
      " Skipping...",
    );
    logger.Error(error);
  }
}

function eventExists(classId) {
  return fs.existsSync(folderPath(classId));
}

function makeDirectory(classID) {
  fs.mkdirSync(folderPath, { recursive: true });
}

function folderPath(classID) {
  return path.join(config.LIVELOX_DIR, String(classId));
}

function writeStatus(classID) {
  const status = { jsonDownload: "True" };

  fs.writeFileSync(
    folderPath(classID),
    JSON.stringify(status, null, 2),
    "utf8",
  );
}

export default downloadJSON;

// downloadJSON(
//   1089654,
//   "//www.livelox.com/Viewer/GR26-03-Interval-6x1k-(unforked)---Las-Mimbres/GR26-03-livelox?classId=1089654&live=false&tab=player",
// );
