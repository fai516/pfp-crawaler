import { parseEnvConfigToProcessEnv } from "@logic/system";
import BigNumber from "bignumber.js";

export const preConfig = () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "develop";
  console.log("[Startup] System is starting up...");
  parseEnvConfigToProcessEnv();
  // Set Big number decimal place to 18
  BigNumber.config({
    DECIMAL_PLACES: +process.env.NORMAL_TO_BASE_UNIT_MULTIPLER
  });
};

preConfig();
