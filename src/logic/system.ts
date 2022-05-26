import path from "path";
import yenv from "yenv";


export const parseEnvConfigToProcessEnv = () => {
  process.env = {
    ...yenv(path.resolve("./env/env.yml"), {
      env: process.env.NODE_ENV || "develop",
    }),
  };
};

