import { measurePeformance, sleepInSec } from "@util/time";
import { writeJsonObject } from "@/src/utils/fs";
import Workers from "@multi-thread/workers";
import Web3 from "web3";
import { abi } from "@constant/erc721";
import { createArray } from "@util/math";

const fullMetadataDirPath = process.cwd() + "/outputs/metadata";
const ipfsBase = "https://ipfs.infura.io/ipfs";

// Bayc: 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
// Azuki: 0xed5af388653567af2f388e6224dc7c4b3241c544
const contractAddr = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const tokenIdRange = {
  start: 2000,
  end: 9999,
};
const workerCount = 20;
const workerOpt = {
  printLog: true,
  printEvery: 1,
};

const web3 = new Web3(process.env.NODE_RPC);
const contract = new web3.eth.Contract(abi, contractAddr);
const getBaseUrl = (tokenId: string): Promise<string> => {
  return contract.methods.tokenURI(tokenId).call();
};
const convertToHttpsBaseUrl = (ipfsUrl: string): string => {
  const regex = new RegExp(/^ipfs:\/\/(?<id>.*)/);
  const match = regex.exec(ipfsUrl);
  return `${ipfsBase}/${match.groups.id}`;
};

measurePeformance(async () => {
  console.log(
    `Starting crawling metadata on ${contractAddr}, from tokenId [${tokenIdRange.start}, ${tokenIdRange.end}]`
  );
  const sourcePath = "./entry/getRequest";
  const numArr = createArray(
    tokenIdRange.end - tokenIdRange.start + 1,
    tokenIdRange.start
  );
  const workers = await new Workers(sourcePath, workerCount, workerOpt).init();
  console.log(numArr);

  await workers.execute(numArr, async (worker, tokenId) => {
    let retryRemaining = +process.env.MAX_FETCH_RETRY_COUNT;
    while (retryRemaining > 0) {
      try {
        const tokenIdStr = tokenId.toString();
        const ipfsTokenUrl = await getBaseUrl(tokenIdStr);
        const httpTokenUrl = convertToHttpsBaseUrl(ipfsTokenUrl);
        const data = await worker.getRequest(httpTokenUrl);
        const filePath = `${fullMetadataDirPath}/${tokenIdStr}.json`
        writeJsonObject(
          filePath,
          data,
          true
        );
        await sleepInSec(+process.env.NEXT_FETCH_WAIT_IN_SEC);
        return `Wrote ${filePath}.`;
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
  console.log("Successful wrote all metadata files.");
}).catch((err) => console.log(err));
