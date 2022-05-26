import { getPicFilesDetail } from "@logic/common";
import { configurePaths } from "@logic/system";
import { setting } from "@/src/config";
import { measurePeformance } from "@util/time";
import { writeJsonObject } from "@/src/utils/fs";
import { convertToRarityConfig } from "@util/convert";

measurePeformance(async () => {
  console.log("Starting rarity template generation...");
  const { input, output } = configurePaths(setting);
  const { layer: layerBasePath } = input;
  const preGenProps = getPicFilesDetail(
    layerBasePath,
    setting.input.layer.query
  );
  const { layers } = preGenProps;

  const { layerLocation, rarity } = output.file;
  writeJsonObject(layerLocation, layers);
  console.log(`Successful wrote ${layerLocation}`);

  const rarityConfig = convertToRarityConfig(layers);
  writeJsonObject(rarity, rarityConfig, true);
  console.log(`Successful wrote ${rarity}`);
}).catch((err) => console.log(err));
