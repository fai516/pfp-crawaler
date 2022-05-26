import { IArtGenSetting } from "@type/art-gen";

export const setting: IArtGenSetting = {
  input: {
    layer: {
      dirPath: "./Desktop/new_arts",
      query: "*.png",
      orders: [
        "Background",
        "Type",
        "Hat",
        "Mouth",
        "Eyes",
        "Clothes",
        "Watch",
        "Pet",
      ],
      isRandom: false, // Case not handled
    },
  },
  output: {
    dirPath: "./Desktop/outs",
    circulation: 6969,
    pic: {
      dirName: "pics",
      width: 1000,
      height: 1000,
      format: "jpg",
    },
    metadata: {
      dirName: "metadata",
      collectionName: "3Rmfer",
      desc: "The 3Rmfer😻fun, creepy and experimental👾",
    },
    tempFileName: {
      rarity: "rarity.json",
      layerLocation: "layer-location.json",
      genGuide: "gen-guide.csv",
    },
  },
};
