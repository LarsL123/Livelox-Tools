const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("../logger");

//EventLink should be of the type: "https://www.livelox.com/Viewer/Lovspretten/H-50-?classId=1189719&live=false&tab=player" so same as when fetching the links.
async function fetchAndSaveClassInfo(classId, eventLink) {
  const response = await fetch("https://www.livelox.com/Data/ClassInfo", {
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
      classIds: [classId],
      courseIds: [],
      relayLegs: [],
      relayLegGroupIds: [],
    }),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  fs.writeFileSync(getJSONPath(classId), JSON.stringify(data, null, 2), "utf8");
}

function extractClassStoreageURL(classId) {
  try {
    const jsonString = fs.readFileSync(getJSONPath(classId), "utf8");
    const data = JSON.parse(jsonString);
    return data["general"]["classBlobUrl"];
  } catch (error) {
    logger.error(
      "Was not able to read ClassStorageURL from file: ",
      getJSONPath(classId),
    );
    throw error;
  }
}

function getJSONPath(classId) {
  return path.join(getPath(classId), "ClassInfo.json");
}

function getPath(classId) {
  return path.join(config.LIVELOX_DIR, String(classId), "jsonDataLL");
}

module.exports = { fetchAndSaveClassInfo, extractClassStoreageURL };
