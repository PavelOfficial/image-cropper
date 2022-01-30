import { fabric } from 'fabric';

import { ImageLoader } from './ImageLoader';
import { CropperView } from '../views/CropperView';

export class CropperController {

  cropperView: CropperView;

  imageLoader: ImageLoader;

  cropEditing = false;

  constructor(htmlCanvas: HTMLCanvasElement) {
    this.imageLoader = new ImageLoader();
    this.cropperView = new CropperView(htmlCanvas);

    this.cropperView.canvas.on('object:moving', this.handleMoving);
  }

  handleMoving = (event: fabric.IEvent<Event>) => {
    if (event.target === this.cropperView.pictureHandle.getRect()) {
      const position = this.cropperView.pictureHandle.getPosition();
      this.cropperView.picture.setPosition(position);
    }
  };

  destroy() {
    //
  }

  setCropEditing(isCropEditing: boolean) {
    this.cropEditing = isCropEditing;
    console.log(this.cropEditing);
  }

  async newImage(imageSrc: string) {
    try {
      let image = await this.imageLoader.load(imageSrc);

      this.cropperView.setPictureImage(image);
    } catch (error) {}
  }

}
