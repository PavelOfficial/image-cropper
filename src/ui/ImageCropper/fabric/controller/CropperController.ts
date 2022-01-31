import { ImageLoader } from './ImageLoader';
import { CropperView } from '../views/CropperView';
import { DEFAULT_MODE } from '../definitions';

import { MODE } from '../types';

export class CropperController {

  cropperView: CropperView;

  imageLoader: ImageLoader;

  cropEditing = false;

  mode = DEFAULT_MODE;

  constructor(htmlCanvas: HTMLCanvasElement) {
    this.imageLoader = new ImageLoader();
    this.cropperView = new CropperView(htmlCanvas);

    this.cropperView.onUpdate = this.subscribe;
  }

  unsubscribe = () => {
    const pictureHandleRect = this.cropperView.pictureHandle.getRect();
    pictureHandleRect.off('moving', this.updateWithPictureHandle);
    pictureHandleRect.off('scaling', this.updateWithPictureHandle);
    pictureHandleRect.off('mousedblclick', this.switchMode);
  };

  subscribe = () => {
    this.unsubscribe();

    const pictureHandleRect = this.cropperView.pictureHandle.getRect();
    pictureHandleRect.on('moving', this.updateWithPictureHandle);
    pictureHandleRect.on('scaling', this.updateWithPictureHandle);
    pictureHandleRect.on('mousedblclick', this.switchMode);
  };

  updateWithPictureHandle = () => {
    if (this.mode === MODE.DRAGGING) {
      this.applyPictureHandleToPicture();
    }
  };

  switchMode = () => {
    if (this.mode === MODE.DRAGGING) {
      this.mode = MODE.CROPPING;
    } else if (this.mode === MODE.CROPPING) {
      this.mode = MODE.DRAGGING;
    }

    this.cropperView.pictureHandle.setMode(this.mode);
    this.cropperView.picture.setMode(this.mode);
    const layout = this.cropperView.pictureHandle.getLayout();
    this.cropperView.picture.setClipLayout(layout);
    this.cropperView.canvas.renderAll();
  };

  applyPictureHandleToPicture() {
    const layout = this.cropperView.pictureHandle.getLayout();
    this.cropperView.picture.transformWithClipLayout(layout);
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
