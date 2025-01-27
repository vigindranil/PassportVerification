import fs from "fs";
import logger from "../utils/logger.js";
import path from "path";
const logDir = path.resolve("./logs");
import readline from 'readline';

export const getLogDetails = async (req, res) => {
    try {
      // Read log files from the directory
      const files = fs.readdirSync(logDir).filter(file => file.endsWith('.log'));
  
      // Check for query parameter to read a specific file
      const { file } = req.query;
  
      if (file) {
        const filePath = path.join(logDir, file);
  
        // Check if the requested file exists
        if (!fs.existsSync(filePath)) {
          return res.status(404).send({ error: `Log file "${file}" not found` });
        }
  
        // Read the log file line by line
        const logs = [];
        const rl = readline.createInterface({
          input: fs.createReadStream(filePath),
          crlfDelay: Infinity, // Recognize all CR LF endings
        });
  
        for await (const line of rl) {
          // Parse each line into a JSON object (customize this based on your log format)
          const [timestamp, level, ...messageParts] = line.split(' | ');
          const log = JSON.parse(messageParts.join(' | '));
          logs.push({ timestamp, level, log });
        }
  
        // Return the logs as JSON
        res.json({ file, logs });
      } else {
        // Return the list of log files if no specific file is requested
        res.json({ files });
      }
    } catch (err) {
      logger.error(`Failed to fetch log files: ${err.message}`);
      res.status(500).send({ error: 'Unable to fetch log files', details: err.message });
    }
  };
