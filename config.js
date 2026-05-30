const path = require("path");

const dataDir = "C:/Users/lars/Desktop/Livelox Scraper/LiveloxData"; //Absolutt path
const logDir = "C:/Users/lars/Desktop/Livelox Scraper/log";

const classFolder = (classID) => path.join(dataDir, String(classID));
module.exports = {
  DATA_DIR: dataDir,
  LOG_DIR: logDir,

  CLASS_FOLDER: classFolder,
  JSON_FOLDER: (classID) => path.join(classFolder(classID), "jsonData"),
};
