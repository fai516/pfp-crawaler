import { performance } from "perf_hooks";
import ms from "pretty-ms";

export const measurePeformance = async (
  func: CallableFunction
): Promise<void> => {
  let start = performance.now();
  await func();
  let diff = performance.now() - start;
  console.log(`Total took ${ms(diff)}`);
};

export const sleepInSec = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
};
