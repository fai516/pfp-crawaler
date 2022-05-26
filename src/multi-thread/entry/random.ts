import { expose } from "threads/worker";
import { pickRandomLayerCombination } from "../../logic/random";

expose({
  pickRandomLayerCombination,
});
