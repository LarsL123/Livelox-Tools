const { downloadMaps } = require("./fetchers/mapImageFetcher");
const logger = require("./logger");

logger.log("Setter i gang :)");

downloadMaps(1089654, 4281885); //If 403, then we need tiles.
