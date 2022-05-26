import {
  LayersCategory,
  ILayerProps,
  IPicFilesDetail,
  IArtGenSetting,
  IOutputPaths,
} from "@type/art-gen";
import glob from "glob";
import { resolve as pathResolve, basename } from "path";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";

export const getFullPath = (pathFromHomeDir: string): string =>
  pathResolve(homedir(), pathFromHomeDir);
export const getSubDirs = (source: string): string[] =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
export const getFilePathsFromDir = (
  basePath: string,
  query: string
): string[] => glob.sync(`${basePath}/${query}`);
export const getPicFilesDetail = (
  layersDirFullPath: string,
  query: string
): IPicFilesDetail => {
  const subDirs = getSubDirs(layersDirFullPath);
  let layers: Record<LayersCategory, ILayerProps[]> = {};
  for (const dirName of subDirs) {
    const layerProps: ILayerProps[] = [];
    const currentDir = `${layersDirFullPath}/${dirName}`;
    const filePaths = getFilePathsFromDir(currentDir, query);
    for (let i = 0; i < filePaths.length; i++) {
      const fileName = basename(filePaths[i]);
      layerProps.push({
        fileFullPath: filePaths[i],
        fileName,
        index: i,
      });
    }
    layers[dirName] = layerProps;
  }
  return {
    basePath: layersDirFullPath,
    layers,
  };
};
export const createOutputDir = (
  outputPath: string,
  setting: IArtGenSetting
): IOutputPaths => {
  const { pic, metadata, tempFileName } = setting.output;
  const picPath = `${outputPath}/${pic.dirName}`;
  const metadataPath = `${outputPath}/${metadata.dirName}`;
  createDirIfNotExist(picPath);
  createDirIfNotExist(metadataPath);
  return {
    dir: {
      pic: picPath,
      metadata: metadataPath,
    },
    file: {
      rarity: `${outputPath}/${tempFileName.rarity}`,
      genGuide: `${outputPath}/${tempFileName.genGuide}`,
      layerLocation: `${outputPath}/${tempFileName.layerLocation}`,
    },
  };
};
export const createDirIfNotExist = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};
