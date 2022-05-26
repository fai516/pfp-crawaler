import { expose } from "threads/worker";
import { compositeJpeg } from "../../logic/image";

expose({
  compositeJpeg,
});
