import { IMoralisIpfsItem, IMoralisIpfsItemResponse } from "@/src/types/api";
import axios, { Axios } from "axios";

let instance: MoralisWeb3Api = null;

export default class MoralisWeb3Api {
  private axios: Axios;
  public constructor(baseUrl = process.env.MORALIS_WEB3_API) {
    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: +process.env.MORALIS_WEB3_API_TIMEOUT_IN_SEC * 1000,
      maxBodyLength: 1000000000000,
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.MORALIS_WEB3_API_KEY,
      },
    });
  }
  static getInstance(baseUrl = process.env.MORALIS_WEB3_API) {
    if (!instance) {
      instance = new MoralisWeb3Api(baseUrl);
    }
    return instance;
  }
  public async uploadIPFS(
    payload: IMoralisIpfsItem[]
  ): Promise<IMoralisIpfsItemResponse[]> {
    try {
      const response = await this.axios.post<IMoralisIpfsItemResponse[]>(
        "v2/ipfs/uploadFolder",
        payload
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}
