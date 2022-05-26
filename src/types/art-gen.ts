export type LayersCategory = string;
export type LayerName = string;
export type Rarity = string;

export type ByLayersCategory<T> = Record<LayersCategory, T>;
export type LayerFilesDetail = ByLayersCategory<ILayerProps[]>;
export type LayerRarity = ByLayersCategory<number[]>;
export type RarityConfig = ByLayersCategory<Record<LayerName, Rarity>>;

export interface ILayerProps {
  fileFullPath: string;
  fileName: string;
  index: number;
}
export interface IInputPaths {
  layer: string;
}
export interface IArtGenPaths {
  input: IInputPaths;
  output: IOutputPaths;
}
export interface IPicFilesDetail {
  basePath: string;
  layers: LayerFilesDetail;
}
export interface IOutputPaths {
  dir: {
    pic: string;
    metadata: string;
  };
  file: {
    rarity: string;
    layerLocation: string;
    genGuide: string;
  };
}
export interface IGenGuide {
  index: number;
  combination: number[];
}
export interface IOpenSeaMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}
export interface IArtGenSetting {
  input: {
    layer: {
      dirPath: string;
      orders: string[];
      isRandom: boolean;
      query: string;
    };
  };
  output: {
    dirPath: string;
    circulation: number;
    pic: {
      dirName: string;
      width: number;
      height: number;
      format: string;
    };
    metadata: {
      dirName: string;
      collectionName: string;
      desc: string;
    };
    tempFileName: {
      rarity: string;
      genGuide: string;
      layerLocation: string;
    };
  };
}
