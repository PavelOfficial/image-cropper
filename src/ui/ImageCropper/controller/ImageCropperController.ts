import { fabric } from 'fabric';
import invariant from "invariant";

import { ImageLoader } from './ImageLoader';

export class ImageCropperController {

  imageLoader: ImageLoader;

  canvas: fabric.Canvas;

  image: fabric.Image|null = null;

  crop: fabric.Image| null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new fabric.Canvas(canvas);
    this.imageLoader = new ImageLoader();
  }

  destroy() {

  }

  setImage(image: fabric.Image) {
    const imageElement = image.getElement();

    invariant(imageElement instanceof HTMLImageElement, 'Image element should be a HTMLImageElement');
    // imageElement.naturalHeight;
    const width = 100;
    const height = 100;

    image.set({
      left: 0,
      top: 0,
      width: imageElement.naturalWidth,
      height: imageElement.naturalHeight,
      scaleX: 0.2,
      scaleY: 0.2,
      hasRotatingPoint: false,
      hasBorders: false,
      lockRotation: true,
      lockUniScaling: true,
      /*
        skewX: width / imageElement.naturalWidth,
        skewY: height / imageElement.naturalHeight,
       */
    });

    if (this.image) {
      this.canvas.remove(this.image);
    }

    this.image = image;
    this.canvas.add(this.image);
  }

  async newImage(imageSrc: string) {
    try {
      let image = await this.imageLoader.load(imageSrc);

      this.setImage(image);
    } catch (error) {}
  }

}
