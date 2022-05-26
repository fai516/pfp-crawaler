import {
  LayerFilesDetail,
  RarityConfig,
  LayerRarity,
  IGenGuide,
  IOpenSeaMetadata,
  IArtGenSetting,
} from "@type/art-gen";
import { toValidProbabilityFormat, toProbabilityIntFormat } from "@util/math";
import { chain, isEmpty } from "lodash";
import BigNumber from "bignumber.js";
import { parse } from "path";

export const convertToNormalUnit = (
  baseUnit: number | string | BigNumber,
  multiplier = process.env.NORMAL_TO_BASE_UNIT_MULTIPLER
): BigNumber =>
  new BigNumber(baseUnit).div(new BigNumber("10").pow(+multiplier));

export const convertToBaseUnit = (
  normalUnit: number | string | BigNumber,
  multiplier = process.env.NORMAL_TO_BASE_UNIT_MULTIPLER
): BigNumber =>
  new BigNumber(normalUnit).multipliedBy(new BigNumber("10").pow(+multiplier));

export const chainIdToChainName = (chainId: string) => {
  console.log(new BigNumber(chainId).toString(10));
};

export const convertToRarityConfig = (
  layerFilesDetail: LayerFilesDetail
): RarityConfig => {
  const result = chain(layerFilesDetail)
    .mapValues((layerProps) => {
      const newObj = chain(layerProps)
        .keyBy("fileName")
        .mapValues(() => "%")
        .value();
      newObj["None"] = "%";
      return newObj;
    })
    .value();
  return result;
};

export const convertToLayerRarity = (
  picFilesDetail: LayerFilesDetail,
  rarityConfig: RarityConfig
): LayerRarity => {
  const result = chain(picFilesDetail)
    .mapValues((layerProps, layerName) => {
      layerProps.push({
        fileFullPath: null,
        fileName: "None",
        index: null,
      });
      return layerProps.map<number>(({ fileName }) => {
        const rawProb = toValidProbabilityFormat(
          rarityConfig[layerName][fileName]
        );
        return toProbabilityIntFormat(rawProb);
      });
    })
    .value();
  return result;
};

export const convertToGenGuides = (lines: string[]): IGenGuide[] => {
  const out: IGenGuide[] = [];
  for (const line of lines) {
    if (!isEmpty(line)) {
      const entry = line.split("|");
      out.push({
        index: +entry[0],
        combination: JSON.parse(entry[1]),
      });
    }
  }
  return out;
};

export const convertToOpenSeaMetadata = (
  setting: IArtGenSetting,
  layers: LayerFilesDetail,
  combination: number[],
  imgUrl: string
): IOpenSeaMetadata => {
  const { input, output } = setting;
  const { orders } = input.layer;
  const { collectionName, desc } = output.metadata;
  const attributes: IOpenSeaMetadata["attributes"] = [];
  for (let i = 0; i < orders.length; i++) {
    const layerName = orders[i];
    const selectedIndex = combination[i];
    if (selectedIndex === -1) {
      continue;
    }
    attributes.push({
      trait_type: layerName,
      value: parse(layers[layerName][selectedIndex].fileName).name,
    });
  }
  return {
    name: collectionName,
    description: desc,
    image: imgUrl,
    attributes,
  };
};
