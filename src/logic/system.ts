import { IArtGenPaths, IArtGenSetting } from "@type/art-gen";
import path from "path";
import yenv from "yenv";
import { getFullPath, createOutputDir } from "./common";

export const parseEnvConfigToProcessEnv = () => {
  process.env = {
    ...yenv(path.resolve("./env/env.yml"), {
      env: process.env.NODE_ENV || "develop",
    }),
  };
};

export const configurePaths = (setting: IArtGenSetting): IArtGenPaths => {
  console.log("Configure Paths...");
  const { input, output } = setting;
  // Config path and create output folders
  const layerBaseDirPath = getFullPath(input.layer.dirPath);
  const outputBaseDirPath = getFullPath(output.dirPath);
  const outputFullPath = createOutputDir(outputBaseDirPath, setting);
  const { dir, file } = outputFullPath;
  console.log("----");
  console.log(`Layers Path: ${layerBaseDirPath}`);
  console.log(`Output Pic Path: ${dir.pic}`);
  console.log(`Output Metadata Path: ${dir.metadata}`);
  console.log(`Temp Rarity File: ${file.rarity}`);
  console.log(`Temp GenGuide File: ${file.genGuide}`);
  console.log(`Temp LayerLocation File: ${file.layerLocation}`);
  console.log("----");
  return {
    input: {
      layer: layerBaseDirPath,
    },
    output: outputFullPath,
  };
};
