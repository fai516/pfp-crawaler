import { configurePaths } from "@logic/system";
import { setting } from "@/src/config";
import { measurePeformance } from "@util/time";
import { readJsonObject, appendCsvFile, removeFileIfExists } from "@/src/utils/fs";
import { LayerFilesDetail, RarityConfig } from "@type/art-gen";
import { convertToLayerRarity } from "@util/convert";
import { validateProbabilityCompleteness } from "@logic/random";
import { createArray } from "@util/math";
import Workers from "@multi-thread/workers";

measurePeformance(async () => {
  console.log("Starting pic guide generation...");
  const { orders } = setting.input.layer;
  const { output } = configurePaths(setting);
  const { rarity, layerLocation, genGuide } = output.file;
  const layers = readJsonObject<LayerFilesDetail>(layerLocation);
  const rarityConfig = readJsonObject<RarityConfig>(rarity);

  const layerRarity = convertToLayerRarity(layers, rarityConfig);
  validateProbabilityCompleteness(layerRarity);

  const numArr = createArray(setting.output.circulation);

  removeFileIfExists(genGuide);

  const sourcePath = "../multi-thread/entry/random";
  const workers = await new Workers(sourcePath, 4).init();
  await workers.execute(numArr, async (worker, index) => {
    const layerCominationIndexes: number[] =
      await worker.pickRandomLayerCombination(layerRarity, orders);
    appendCsvFile(
      genGuide,
      `${index}|${JSON.stringify(layerCominationIndexes)}`
    );
    return `Wrote a line on GenGuide file with index ${index}`;
  });
  console.log("Successful wrote all on GenGuide.");
  await workers.terminate();
}).catch((err) => console.log(err));
