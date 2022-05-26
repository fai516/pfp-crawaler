import { expose } from "threads/worker";
import { parseEnvConfigToProcessEnv } from "../../logic/system";
import axios from "axios";

expose({
  async getRequest(url: string, responseType = "json") {
    parseEnvConfigToProcessEnv();
    const { data } = await axios.get(url, { responseType });
    return data;
  },
});
