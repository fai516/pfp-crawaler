import { LayerRarity } from "@type/art-gen";
import {
  validateIntSum,
  toProbabilityIntFormat,
  getRandomSelectedIndexByProb,
} from "../utils/math";

export const validateProbabilityCompleteness = (
  layerRarity: LayerRarity
): void => {
  const layerNames = Object.keys(layerRarity);
  for (const layerName of layerNames) {
    try {
      validateIntSum(layerRarity[layerName], toProbabilityIntFormat(100));
    } catch (err) {
      throw new Error(
        `Layer ${layerName} has invalid probability completeness: ${err.message}`
      );
    }
  }
};

export const pickRandomLayerCombination = async (
  layerRarity: LayerRarity,
  orders: string[]
): Promise<number[]> => {
  try {
    const layerCombination: number[] = [];
    for (const layerName of orders) {
      const probInt = layerRarity[layerName];
      let selectedIndex = await getRandomSelectedIndexByProb(probInt);
      if (selectedIndex === probInt.length - 1) {
        selectedIndex = -1;
      }
      layerCombination.push(selectedIndex);
    }
    return layerCombination;
  } catch (err) {
    throw new Error(`[pickRandomLayerCombination] Exception: ${err}`);
  }
};
