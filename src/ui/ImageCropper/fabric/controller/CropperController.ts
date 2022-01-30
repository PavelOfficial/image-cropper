import { ImageLoader } from './ImageLoader';

import { CropperView } from '../views/CropperView';

export class CropperController {

  cropperView: CropperView;

  imageLoader: ImageLoader;

  cropEditing = false;

  constructor(htmlCanvas: HTMLCanvasElement) {
    this.imageLoader = new ImageLoader();
    this.cropperView = new CropperView(htmlCanvas);
  }

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
