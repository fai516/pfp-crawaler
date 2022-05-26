import { expose } from "threads/worker";
import { uploadImgToIpfs } from "../../logic/ipfs-uploader";
import { parseEnvConfigToProcessEnv } from "../../logic/system";

expose({
  uploadImgToIpfs(imgPath: string) {
    parseEnvConfigToProcessEnv();
    return uploadImgToIpfs(imgPath);
  },
});
