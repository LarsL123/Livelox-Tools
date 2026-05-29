const fs = require("fs");
const path = require("path");
const config = require("../config");

//classStorage should be of the type: "https://livelox.blob.core.windows.net/class-storage/0001189719_3988880102436"
async function fetchAndSaveMapData(classId, classStorageURL) {
  try {
    const response = await fetch(classStorageURL, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5,sv;q=0.4",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "https://www.livelox.com/",
      },
      body: null,
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    fs.writeFileSync(
      getJSONPath(classId),
      JSON.stringify(data, null, 2),
      "utf8",
    );
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  }
}

// fetchAndSaveMapData(
//   "https://livelox.blob.core.windows.net/class-storage/0001189719_3988880102436",
//   ".",
// );

function getJSONPath(classId) {
  return path.join(
    config.LIVELOX_DIR,
    String(classId),
    "jsonDataLL",
    "MapData.json",
  );
}

module.exports = { fetchAndSaveMapData };
