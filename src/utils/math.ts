import randomInt from "random-number-csprng";
import Big from "big.js";
import { isNil, sum, orderBy } from "lodash";

export interface IProbInt {
  index: number;
  value: number;
}

export const validProbabilityFormat = /(?<percentage>[0-9]+(\.[0-9]+)?)%/;
export const toValidProbabilityFormat = (input: string): number => {
  const matches = validProbabilityFormat.exec(input);
  if (isNil(matches)) {
    throw new Error(`${input} is not a valid probability format`);
  }
  return parseFloat(matches.groups.percentage);
};
export const validateIntSum = (ints: number[], expectedSum: number): void => {
  if (sum(ints) !== expectedSum) {
    throw new Error(`Expected sum of ${ints} is not equal to ${expectedSum}`);
  }
};
export const toProbabilityIntFormat = (n: number): number => {
  const multipier = new Big(10).pow(
    +process.env.ART_GENERATION_PROBABILITY_PERCENTAGE_DECIMAL
  );
  return new Big(n).mul(multipier).toNumber();
};
export const getTheNearestGreaterIndexByValue = (
  sortedProbInts: IProbInt[],
  targetInput: number
): number => {
  let sum = 0;
  const accumulativeSums = sortedProbInts.map(({ value }) => (sum += value));
  for (let i = 0; i < accumulativeSums.length; i++) {
    if (targetInput <= accumulativeSums[i]) {
      return sortedProbInts[i].index;
    }
  }
  throw new Error(
    `${sortedProbInts} supposed output target index for ${targetInput}`
  );
};
export const getRandomSelectedIndexByProb = async (
  probInts: number[]
): Promise<number> => {
  try {
    const maxInt = sum(probInts);
    const sortedpPobIntWithIndexes: IProbInt[] = orderBy(
      probInts.map((num, index) => ({
        index,
        value: num,
      })),
      ["value"],
      ["asc"]
    );
    const randInt = await randomInt(1, maxInt);
    return getTheNearestGreaterIndexByValue(sortedpPobIntWithIndexes, randInt);
  } catch (err) {
    throw new Error(
      `[getRandomSelectedIndexByProb] probInts: ${probInts} | Exception: ${err}`
    );
  }
};
export const createArray = (length: number, offset=0): number[] =>
  Array.from({ length }, (_, index) => index+offset);
