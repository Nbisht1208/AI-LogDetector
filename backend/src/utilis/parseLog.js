import fs from "fs";
import readline from "readline";

// Streaming parser: memory-efficient
export const parseLogFile = async (filePath, callback) => {
  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let totalLines = 0;
  for await (const line of rl) {
    totalLines++;
    callback(line);
  }
  return totalLines;
};

// Regex metadata extractor
export const extractMetadata = (line) => {
  return {
    ip: line.match(/\b\d{1,3}(\.\d{1,3}){3}\b/)?.[0],
    timestamp: line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)?.[0],
    severity: line.match(/\b(INFO|WARN|ERROR|DEBUG)\b/)?.[0],
    user: line.match(/user=([a-zA-Z0-9]+)/)?.[1],
    endpoint: line.match(/(GET|POST|PUT|DELETE) [^\s]+/)?.[0],
  };
};
