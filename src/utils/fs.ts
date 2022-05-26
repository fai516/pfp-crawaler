import {
  writeFileSync,
  readFileSync,
  appendFileSync,
  unlinkSync,
  existsSync,
} from "fs";
import os from "os";
import { isNil } from "lodash";

export const parseCid = (url: string): string => {
  const cidFormat = new RegExp(`.*\/(?<cid>[0-9a-zA-Z+/]{46})`);
  const matches = cidFormat.exec(url);
  if (isNil(matches)) {
    throw new Error(`Unable to parse cid with input ${url}`);
  }
  return matches.groups.cid;
};

export const writeJsonObject = async (
  filePath: string,
  obj: object,
  parse = false
) => {
  return writeFileSync(
    filePath,
    parse ? JSON.stringify(obj, null, 2) : JSON.stringify(obj)
  );
};
export const readJsonObject = <T>(filePath: string): T => {
  let rawDataStr = readFileSync(filePath, "utf-8");
  return JSON.parse(rawDataStr) as T;
};
export const appendCsvFile = (filePath: string, data: string) => {
  appendFileSync(filePath, data + os.EOL);
};
export const removeFileIfExists = (filePath: string) => {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
};
export const readFileSplitByLine = (filePath: string): string[] => {
  let rawDataStr = readFileSync(filePath, "utf-8");
  return rawDataStr.split(os.EOL);
};
export const readFileToBase64 = (filePath: string): string => {
  let rawData = readFileSync(filePath);
  return rawData.toString("base64");
};
