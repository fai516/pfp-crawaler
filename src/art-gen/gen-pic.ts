import { LayerFilesDetail } from "@type/art-gen";
import { configurePaths } from "@logic/system";
import { setting } from "@/src/config";
import { measurePeformance } from "@util/time";
import { readFileSplitByLine, readJsonObject } from "@/src/utils/fs";
import { convertToGenGuides } from "@util/convert";
import Workers from "@multi-thread/workers";
import { fetchLayerPathsByOrder } from "@logic/image";

const workerCount = 4;
const workerOpt = {
  printLog: true,
  printEvery: 50,
};

measurePeformance(async () => {
  console.log("Starting picture generation...");
  const { output: outputPath } = configurePaths(setting);
  const { input, output } = setting;
  const { orders } = input.layer;
  const { genGuide: genGuidePath, layerLocation } = outputPath.file;

  const lines = readFileSplitByLine(genGuidePath);
  const genGuides = convertToGenGuides(lines);

  const layers = readJsonObject<LayerFilesDetail>(layerLocation);

  const sourcePath = "../multi-thread/entry/image";
  const workers = await new Workers(sourcePath, workerCount, workerOpt).init();
  await workers.execute(genGuides, async (worker, guide) => {
    const { index, combination } = guide;
    const paths = fetchLayerPathsByOrder(layers, orders, combination);
    await worker.compositeJpeg(
      paths,
      output.pic,
      `${outputPath.dir.pic}/${index}.${output.pic.format}`
    );
    return `Generated picture #${index} with combination ${JSON.stringify(
      combination
    )}`;
  });
  await workers.terminate();
  console.log("Successful wrote all picture on output pic path.");
}).catch((err) => console.log(err));
