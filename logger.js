const fs = require("fs");
const path = require("path");
const config = require("./config");

fs.mkdirSync(config.LOG_DIR, { recursive: true });
const runId = new Date().toISOString().replace(/[:.]/g, "-");
// const textLogPath = path.join(config.LOG_DIR, `${runId}.log`);
const jsonLogPath = path.join(config.LOG_DIR, `${runId}.jsonl`);

const logger = {
  log: (...args) => write("INFO", args, true),
  warn: (...args) => write("WARN", args, true),
  error: (...args) => write("ERROR", args, true),

  fileLog: (...args) => write("INFO", args, false),
  fileWarn: (...args) => write("WARN", args, false),
  fileError: (...args) => write("ERROR", args, false),

  paths: {
    // text: textLogPath,
    json: jsonLogPath,
  },
};

module.exports = logger;

function serialize(args) {
  const str = args.map((arg) => {
    if (arg instanceof Error) {
      return arg.stack || arg.message;
    }

    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg);
      } catch {
        return "[Circular Object]";
      }
    }

    return String(arg);
  });

  return str.join(" ");
}

function write(level, args, toConsole = false) {
  const timestamp = new Date().toLocaleTimeString();

  const message = serialize(args);
  const textLine = `[${timestamp}] [${level}] ${message}\n`;

  const jsonLine =
    JSON.stringify({
      timestamp,
      level,
      message,
    }) + "\n";

  // Append immediately (safer for crashes)
  // fs.appendFileSync(textLogPath, textLine);
  fs.appendFileSync(jsonLogPath, jsonLine);

  if (toConsole) {
    const method =
      level === "ERROR"
        ? console.error
        : level === "WARN"
          ? console.warn
          : console.log;

    method(textLine.trim());
  }
}
