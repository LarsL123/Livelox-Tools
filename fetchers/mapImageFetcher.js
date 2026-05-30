const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("../logger");

//"https://www.livelox.com/Viewer/Lovspretten/H-21?classId=1189727&live=false&tab=player&selectedParticipantId=4618182"

async function fetchAndSaveMaps(classId, selectedParticipantId) {
  classId = String(classId);
  selectedParticipantId = String(selectedParticipantId);

  const { blankImageURI, routeImageURI } = getURLs(
    classId,
    selectedParticipantId,
  );

  const imageDir = path.join(config.CLASS_FOLDER(classId), "exportedMaps");

  const fileRouteName = `${classId}.route.jpg`;
  const fileBlankName = `${classId}.blank.jpg`;

  const fileRoutePath = path.join(imageDir, fileRouteName);
  const fileBlankPath = path.join(imageDir, fileBlankName);

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }

  try {
    await downloadURIImage(routeImageURI, fileRoutePath);
    await downloadURIImage(blankImageURI, fileBlankPath);
  } catch (error) {
    logger.error("Error while downloading maps from classID", classId, error);
    throw error;
  }
}

function getURLs(classId, selectedParticipant) {
  const blankImageURI =
    "https://www.livelox.com/Classes/MapImage?classIds=" +
    classId +
    "&fileFormat=jpg&includeCoursePrint=true&controlNumbers=true&download=true";

  const routeImageURI =
    "https://www.livelox.com/Classes/MapImage?classIds=" +
    classId +
    "&participantIds=" +
    selectedParticipant +
    "&routeStyle=2&colorRangeStart=1.0869565217391304&colorRangeEnd=3.0303030303030303&fileFormat=jpeg&includeCoursePrint=true&controlNumbers=true&download=true";

  return { blankImageURI, routeImageURI };
}

async function downloadURIImage(uri, savePath) {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(savePath, buffer);

  logger.log(`Image downloaded successfully to: ${savePath}`);
}

module.exports = { fetchAndSaveMaps };
