import { LayerFilesDetail, IArtGenSetting } from "@type/art-gen";
import sharp from "sharp";

export const fetchLayerPathsByOrder = (
  layerFileDetail: LayerFilesDetail,
  orders: string[],
  combination: number[]
): string[] => {
  let paths: string[] = [];
  for (let i = 0; i < orders.length; i++) {
    const layerIndex = combination[i];
    if (layerIndex === -1) {
      continue;
    }
    const layerName = orders[i];
    const layerProp = layerFileDetail[layerName][layerIndex];
    paths.push(layerProp.fileFullPath);
  }
  return paths;
};

export const compositeJpeg = async (
  paths: string[],
  picSetting: IArtGenSetting["output"]["pic"],
  outFilePath: string
) => {
  const firstLayer = paths[0];
  const restLayers = paths.slice(1);
  try {
    const buffer = await sharp(firstLayer)
      .composite(restLayers.map((path) => ({ input: path })))
      .jpeg({ quality: 80 })
      .toBuffer();
    const { width, height } = picSetting;
    await sharp(buffer).resize(width, height).toFile(outFilePath);
  } catch (err) {
    throw err;
  }
};
