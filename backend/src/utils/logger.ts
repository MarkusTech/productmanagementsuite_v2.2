import { createLogger, format, transports } from "winston";
import * as fs from "fs";
import * as path from "path";

const { combine, timestamp, printf, colorize } = format;

const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create Winston logger
const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamps to logs
    colorize(),
    logFormat
  ),
  transports: [
    // Console transport (for development)
    new transports.Console(),

    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),

    new transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
  ],
});

export default logger;
