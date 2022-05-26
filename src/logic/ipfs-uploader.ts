import MoralisWeb3Api from "../api/moralis-web3";
import { basename } from "path";
import { readFileToBase64 } from "../utils/fs";
import { IMoralisIpfsItem } from "@/src/types/api";

export const uploadImgToIpfs = async (imgPath: string): Promise<string> => {
  const api = MoralisWeb3Api.getInstance();
  const base64 = readFileToBase64(imgPath);
  const fileName = basename(imgPath);
  const response = await api.uploadIPFS([
    {
      path: fileName,
      content: base64,
    },
  ]);
  return response[0].path;
};

export const uploadAllMetadataToIpfs = async (
  moralisIpfsItems: IMoralisIpfsItem[]
): Promise<string> => {
  const api = MoralisWeb3Api.getInstance();
  const response = await api.uploadIPFS(moralisIpfsItems);
  return response[0].path;
};
