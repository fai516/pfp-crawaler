import { IMoralisIpfsItem } from "@/src/types/api";
import { getFilePathsFromDir } from "@logic/common";
import { configurePaths } from "@logic/system";
import MoralisWeb3Api from "@api/moralis-web3";
import { setting } from "@/src/config";
import { measurePeformance, sleepInSec } from "@util/time";
import { uploadAllMetadataToIpfs } from "@logic/ipfs-uploader";
import { parseCid, readFileToBase64 } from "@util/fs";
import { parse } from "path";

export const upload = async (items: IMoralisIpfsItem[]): Promise<void> => {
  const api = new MoralisWeb3Api();
  const response = await api.uploadIPFS(items);
  console.log(response);
};

measurePeformance(async () => {
  console.log("Starting metadata IFPS deployment and meta generation...");
  const { output: outputPath } = configurePaths(setting);
  const { metadata: metadataDir } = outputPath.dir;

  const metadataPaths = getFilePathsFromDir(metadataDir, "*");
  const ifpsItems: IMoralisIpfsItem[] = metadataPaths.map((path) => ({
    path: parse(path).name,
    content: readFileToBase64(path)
  }))
  let retryRemaining = +process.env.MAX_FETCH_RETRY_COUNT;
  while (retryRemaining > 0) {
    try {
      const rawUrl = await uploadAllMetadataToIpfs(ifpsItems);
      const cid = parseCid(rawUrl);
      console.log(
        `Successful uploaded all metadata files. Contract baseUrl: ipfs://${cid}/`
      );
      return;
    } catch (err) {
      console.log(
        `Retry upload metadata (Remaining: ${retryRemaining--}) Err: ${err}`
      );
      await sleepInSec(+process.env.RETRY_SLEEP_IN_SEC);
    }
  }
  throw new Error(`Fail to upload metadata from dir ${metadataDir}`);
}).catch((err) => console.log(err));
