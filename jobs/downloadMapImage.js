const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("../logger");

const { appendStatusFile } = require("../services/jsonService");
const { fetchAndSaveMaps } = require("../fetchers/mapImageFetcher");

downloadImages(1189371, 4615433);

async function downloadImages(classID, participantID) {
  try {
    await fetchAndSaveMaps(classID, participantID);
    appendStatusFile(classID, { maps: "DOWNLOADED" });
    logger.log("Successfully downloaded the map files for classID: ", classID);
  } catch (err) {
    logger.error(
      "Was not able to downlaod map files for,classID: ",
      classID,
      " Skipping...",
    );
    logger.error(err);
  }
}

module.exports = downloadImages;
