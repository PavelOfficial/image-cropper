import { fabric } from 'fabric';

import { ImageLoader } from './ImageLoader';
import { Picture } from '../views/Picture';
import { CropperCanvas } from '../views/CropperCanvas';

export class CropperController {

  cropperCanvas: CropperCanvas;

  imageLoader: ImageLoader;

  cropEditing = false;

  constructor(htmlCanvas: HTMLCanvasElement) {
    this.imageLoader = new ImageLoader();
    this.cropperCanvas = new CropperCanvas(htmlCanvas);
  }

  destroy() {
    //
  }

  setCropEditing(isCropEditing: boolean) {
    this.cropEditing = isCropEditing;
    console.log(this.cropEditing);
  }

  setImage(image: fabric.Image) {
    const picture = new Picture(image);

    this.cropperCanvas.setPicture(picture);
  }

  async newImage(imageSrc: string) {
    try {
      let image = await this.imageLoader.load(imageSrc);

      this.setImage(image);
    } catch (error) {}
  }

}
