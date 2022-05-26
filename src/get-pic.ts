import { measurePeformance, sleepInSec } from "@util/time";
import { readJsonObject } from "@/src/utils/fs";
import Workers from "@multi-thread/workers";
import { createArray } from "@util/math";
import axios from "axios";
import { writeFileSync } from "fs";

const fullMetadataDirPath = process.cwd() + "/outputs/metadata";
const fullPicDirPath = process.cwd() + "/outputs/pic";
const ipfsBase = "https://ipfs.moralis.io:2053/ipfs/";

const tokenIdRange = {
  start: 4000,
  end: 9999,
};

const workerCount = 15;
const workerOpt = {
  printLog: true,
  printEvery: 1,
};

const convertToHttpsBaseUrl = (ipfsUrl: string): string => {
  const regex = new RegExp(/^ipfs:\/\/(?<id>.*)/);
  const match = regex.exec(ipfsUrl);
  return `${ipfsBase}/${match.groups.id}`;
};

const main = async () => {
  const tokenId = "0";
  const metadata = readJsonObject<any>(
    `${fullMetadataDirPath}/${tokenId}.json`
  );
  const imgHttpUrl = convertToHttpsBaseUrl(metadata.image);

  console.log(imgHttpUrl);
  const { data } = await axios.get(imgHttpUrl, { responseType: "arraybuffer" });
  const fullPicFilePath = `${fullPicDirPath}/${tokenId}.jpg`;
  writeFileSync(fullPicFilePath, data);
};

main().catch((err) => console.log(err));
measurePeformance(async () => {
  console.log(
    `Starting crawling pic on metadata, from tokenId [${tokenIdRange.start}, ${tokenIdRange.end}]`
  );
  const sourcePath = "./entry/getRequest";
  const numArr = createArray(
    tokenIdRange.end - tokenIdRange.start + 1,
    tokenIdRange.start
  );
  const workers = await new Workers(sourcePath, workerCount, workerOpt).init();

  await workers.execute(numArr, async (worker, tokenId) => {
    let retryRemaining = +process.env.MAX_FETCH_RETRY_COUNT;
    while (retryRemaining > 0) {
      try {
        const tokenIdStr = tokenId.toString();
        const metadata = readJsonObject<any>(
          `${fullMetadataDirPath}/${tokenIdStr}.json`
        );
        const imgHttpUrl = convertToHttpsBaseUrl(metadata.image);

        const data = await worker.getRequest(imgHttpUrl, "arraybuffer");
        const fullPicFilePath = `${fullPicDirPath}/${tokenIdStr}.jpg`;
        writeFileSync(fullPicFilePath, data);

        await sleepInSec(+process.env.NEXT_FETCH_WAIT_IN_SEC);
        return `Wrote ${fullPicFilePath}.`;
      } catch (err) {
        console.log(
          `Retry tokenId ${tokenId} (Remaining: ${retryRemaining--}) Err: ${err}`
        );
        await sleepInSec(+process.env.RETRY_SLEEP_IN_SEC); // Prevent too many request
      }
    }
    throw new Error(`Fail on tokenId ${tokenId}`);
  });
  await workers.terminate();
  console.log("Successful wrote all pic files.");
}).catch((err) => console.log(err));
