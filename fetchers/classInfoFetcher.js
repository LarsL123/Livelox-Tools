const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("../logger");

const { saveJson, loadJson } = require("../services/jsonService");

//EventLink should be of the type: "https://www.livelox.com/Viewer/Lovspretten/H-50-?classId=1189719&live=false&tab=player" so same as when fetching the links.
async function fetchAndSaveClassInfo(classID, eventLink) {
  try {
    const response = await fetchClassInfo(classID, eventLink);

    if (!response.ok)
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    saveJson(getClassInfoPath(classID), data);
  } catch (err) {
    logger.error("Was not able to get ClassInfo: ", err);
    throw err;
  }
}

function extractClassStoreageURL(classID) {
  try {
    const data = loadJson(getClassInfoPath(classID));
    return data["general"]["classBlobUrl"];
  } catch (err) {
    logger.error(
      "Was not able to read ClassStorageURL from file: ",
      getClassInfoPath(classID),
    );
    throw err;
  }
}

function fetchClassInfo(classID, eventLink) {
  return fetch("https://www.livelox.com/Data/ClassInfo", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language":
        "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5,sv;q=0.4",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      cookie: "",
      Referer: eventLink,
    },
    body: JSON.stringify({
      eventId: null,
      classIds: [classID],
      courseIds: [],
      relayLegs: [],
      relayLegGroupIds: [],
    }),
    method: "POST",
  });
}

function getClassInfoPath(classID) {
  return path.join(config.JSON_FOLDER(classID), "ClassInfo.json");
}

module.exports = { fetchAndSaveClassInfo, extractClassStoreageURL };
