const fs = require("fs");
const path = require("path");
const config = require("../config");
const logger = require("../logger");

const folderPath = path.join(config.DATA_DIR, "rawLinkData");
const files = fs.readdirSync(folderPath);
const links = [];

for (const file of files) {
  if (!file.endsWith(".json")) continue;

  const filePath = path.join(folderPath, file);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    logger.error(`Failed to parse ${file}:`, err.message);
    continue;
  }

  if (!data.response || !data.response.sessions) {
    logger.error(`No sessions in ${file}`);
    continue;
  }

  for (const session of data.response.sessions) {
    if (session.participants === undefined) {
      continue;
    }

    if (session.participants.length > 1) {
      logger.error("UNKNOWN ERROR CHECK, Double enaty??");
      logger.error(session);
    }

    const link = buildLink(session.participants[0]);
    const date = session.timeInterval.start;
    const participantId = session.participants[0].id;

    links.push({ date: date, link: link, participantId: participantId });
  }
}
// Sort oldest → newest
links.sort((a, b) => new Date(a.date) - new Date(b.date));

const outputPath = path.join(config.DATA_DIR, "links.json");
fs.writeFileSync(outputPath, JSON.stringify(links, null, 2), "utf8");

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

function linkify(str) {
  return str
    .replaceAll(" ", "-")
    .replaceAll("#", "")
    .replaceAll("ø", "o") //Do i need this the two last??
    .replaceAll("å", "a");
}
