import { LayerFilesDetail } from "@type/art-gen";
import { configurePaths } from "@logic/system";
import { setting } from "@/src/config";
import { measurePeformance, sleepInSec } from "@util/time";
import {
  readFileSplitByLine,
  readJsonObject,
  writeJsonObject,
  parseCid,
} from "@/src/utils/fs";
import { convertToGenGuides, convertToOpenSeaMetadata } from "@util/convert";
import Workers from "@multi-thread/workers";
import { getFilePathsFromDir } from "@logic/common";
import { chain } from "lodash";
import { parse } from "path";

const workerCount = 1;
const workerOpt = {
  printLog: true,
  printEvery: 1,
};

measurePeformance(async () => {
  console.log("Starting picture IFPS deployment and metadata generation...");
  const { output: outputPath } = configurePaths(setting);
  const { output } = setting;
  const picfilePaths = getFilePathsFromDir(
    outputPath.dir.pic,
    `*.${output.pic.format}`
  );
  const { genGuide: genGuidePath, layerLocation } = outputPath.file;

  const lines = readFileSplitByLine(genGuidePath);
  const genGuides = convertToGenGuides(lines);
  const sortedGenGuides = chain(genGuides).orderBy(["index"], ["asc"]).value();

  const layers = readJsonObject<LayerFilesDetail>(layerLocation);

  const sourcePath = "../multi-thread/entry/uploader";
  const workers = await new Workers(sourcePath, workerCount, workerOpt).init();

  await workers.execute(picfilePaths, async (worker, path) => {
    let retryRemaining = +process.env.MAX_FETCH_RETRY_COUNT;
    while (retryRemaining > 0) {
      try {
        const rawUrl = await worker.uploadImgToIpfs(path);
        const cid = parseCid(rawUrl);
        const fileName = parse(rawUrl).base;
        const ipfsUrl = `ipfs://${cid}/${fileName}`;
        const index = +parse(ipfsUrl).name;
        const metadata = convertToOpenSeaMetadata(
          setting,
          layers,
          sortedGenGuides[index].combination,
          ipfsUrl
        );
        writeJsonObject(`${outputPath.dir.metadata}/${index}`, metadata);
        await sleepInSec(+process.env.NEXT_FETCH_WAIT_IN_SEC);
        return `Uploaded image with url ${ipfsUrl} and wrote metadata file`;
      } catch (err) {
        console.log(
          `Retry ${path} (Remaining: ${retryRemaining--}) Err: ${err}`
        );
        await sleepInSec(+process.env.RETRY_SLEEP_IN_SEC); // Prevent too many request
      }
    }
    throw new Error(`Fail to upload ${path}`);
  });
  await workers.terminate();
  console.log("Successful uploaded images and wrote all metadata file.");
}).catch((err) => console.log(err));
