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

    this.cropperView.onUpdate = this.subscribe;
  }

  unsubscribe = () => {
    const pictureHandleRect = this.cropperView.pictureHandle.getRect();

    pictureHandleRect.off('moving', this.updateWithPictureHandle);
    pictureHandleRect.off('scaling', this.updateWithPictureHandle);
  };

  subscribe = () => {
    const pictureHandleRect = this.cropperView.pictureHandle.getRect();
    this.unsubscribe();

    pictureHandleRect.on('moving', this.updateWithPictureHandle);
    pictureHandleRect.on('scaling', this.updateWithPictureHandle);
  };

  updateWithPictureHandle = () => {
    const layout = this.cropperView.pictureHandle.getLayout();
    this.cropperView.picture.setLayout(layout);
  };

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
