const fs = require("fs");
const path = require("path");

const folderPath = "./collectLinks/downloadedPages";
const files = fs.readdirSync(folderPath);

const links = [];

for (const file of files) {
  if (!file.endsWith(".json")) continue;

  const filePath = path.join(folderPath, file);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`Failed to parse ${file}:`, err.message);
    continue;
  }

  if (!data.response || !data.response.sessions) {
    console.error(`No sessions in ${file}`);
    continue;
  }

  for (const session of data.response.sessions) {
    if (session.participants === undefined) {
      console.log("Session not connected to a livelox event.");
      continue;
    }

    if (session.participants.length > 1) {
      console.error("UNKNOWN ERROR CHECK");
      console.error(session);
      continue;
    }

    const link = buildLink(session.participants[0]);
    const date = session.timeInterval.start;

    links.push({ date: date, link: link });
  }
}

// Sort oldest → newest
links.sort((a, b) => new Date(a.date) - new Date(b.date));

dataDir = path.join("");

fs.writeFileSync("links.json", JSON.stringify(links, null, 2), "utf8");
console.log(links);

function buildLink(eventInfo) {
  const eventName = linkify(eventInfo.eventName);
  const className = linkify(eventInfo.className);

  return (
    "https://www.livelox.com/Viewer/" +
    eventName +
    "/" +
    className +
    "?classId=" +
    eventInfo.classId +
    "&live=false&tab=player"
  );
}

//Actually dont think this is needed. It eats the link anyways.
function linkify(str) {
  return str.replaceAll(" ", "-").replaceAll("ø", "o").replaceAll("å", "a");
}
