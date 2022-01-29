import { fabric } from 'fabric';
import { IEvent } from "fabric/fabric-impl";

import invariant from "invariant";

import { ImageLoader } from './ImageLoader';

export class ImageCropperController {

  imageLoader: ImageLoader;

  canvas: fabric.Canvas;

  image: fabric.Image|null = null;

  crop: fabric.Image| null = null;

  cropEditing = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new fabric.Canvas(canvas);
    this.canvas.on('mouse:dblclick', this.handleDblclick);
    this.imageLoader = new ImageLoader();
  }

  handleDblclick = (event: IEvent<MouseEvent>) => {
    if (event.target === this.image) {
      this.setCropEditing(!this.cropEditing);
      console.log('image clicked !!!');
    }
  }

  destroy() {

  }

  setCropEditing(isCropEditing: boolean) {
    this.cropEditing = isCropEditing;
    console.log(this.cropEditing);
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
