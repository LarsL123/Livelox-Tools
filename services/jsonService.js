const fs = require("fs");
const path = require("path");
const config = require("../config");

function loadJson(filePath, defaultValue = {}) {
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function updateJson(filePath, updates) {
  const current = loadJson(filePath);
  const updated = {
    ...current,
    ...updates,
  };

  saveJson(filePath, updated);

  return updated;
}

const statusFileName = "completedJobs.json";
function getFilePath(classID) {
  return path.join(config.CLASS_FOLDER(classID), statusFileName);
}

function createStatusFile(classID, statusStr) {
  saveJson(getFilePath(classID), {
    jsonDownload: statusStr,
  });
}

function appendStatusFile(classID, updateObj) {
  return updateJson(getFilePath(classID), updateObj);
}

function loadStatusFile(classID) {
  return loadJson(getFilePath(classID));
}

module.exports = {
  loadJson,
  saveJson,
  updateJson,
  createStatusFile,
  appendStatusFile,
  loadStatusFIle: loadStatusFile,
};
