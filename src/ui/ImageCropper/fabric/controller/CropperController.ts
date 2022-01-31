import { ImageLoader } from './ImageLoader';
import { CropperView } from '../views/CropperView';
import { DEFAULT_MODE } from '../definitions';

import { MODE } from '../types';
import { NullMovingTransition, MovingTransition } from '../geometry/MovingTransition';
import {fabric} from "fabric";

export class CropperController {

  cropperView: CropperView;

  imageLoader: ImageLoader;

  handleToPictureMoving: MovingTransition = new NullMovingTransition();

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

    // pictureHandleRect.off('moving', this.terminatePicture);
    pictureHandleRect.off('scaling', this.terminatePictureHandle);

    pictureHandleRect.off('mousedown', this.startMoving);
    pictureHandleRect.off('moving', this.translateMoving);
    pictureHandleRect.off('moving', this.terminatePictureMoving);

    pictureHandleRect.off('mousedblclick', this.switchMode);

    const image = this.cropperView.picture.getImage();

    image.off('moving', this.terminatePictureMoving);
    image.off('scaling', this.terminatePictureScaling);
  };

  subscribe = () => {
    this.unsubscribe();

    const pictureHandleRect = this.cropperView.pictureHandle.getRect();

    pictureHandleRect.on('moving', this.updateWithPictureHandle);
    pictureHandleRect.on('scaling', this.updateWithPictureHandle);

    // pictureHandleRect.on('moving', this.terminatePicture);
    pictureHandleRect.on('scaling', this.terminatePictureHandle);

    pictureHandleRect.on('mousedown', this.startMoving);
    pictureHandleRect.on('moving', this.translateMoving);
    pictureHandleRect.on('moving', this.terminatePictureMoving);

    pictureHandleRect.on('mousedblclick', this.switchMode);

    const image = this.cropperView.picture.getImage();

    image.on('moving', this.terminatePictureMoving);
    image.on('scaling', this.terminatePictureScaling);
  };

  startMoving = () => {
    if (this.mode === MODE.CROPPING) {
      const targetView = this.cropperView.picture;
      const originView = this.cropperView.pictureHandle;
      this.handleToPictureMoving = new MovingTransition(
        targetView,
        originView,
      );
    }
  };

  translateMoving = () => {
    if (this.mode === MODE.CROPPING) {
      this.handleToPictureMoving.translate();
    }
  };

  terminatePictureHandle = () => {
    if (this.mode === MODE.CROPPING) {
      const layout = this.cropperView.picture.getAbsoluteLayout();
      this.cropperView.pictureHandle.terminateScale(layout);
    }
  };

  terminatePictureMoving = () => {
    if (this.mode === MODE.CROPPING) {
      const layout = this.cropperView.pictureHandle.getAbsoluteLayout();
      this.cropperView.picture.terminateMoving(layout);
    }
  };

  terminatePictureScaling = (event: any) => {
    if (this.mode === MODE.CROPPING) {
      const layout = this.cropperView.pictureHandle.getAbsoluteLayout();
      this.cropperView.picture.terminateScaling(layout, event.transform.corner);
    }
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

    if (this.mode === MODE.DRAGGING) {
      const layout = this.cropperView.pictureHandle.getLayout();
      this.cropperView.picture.setClipLayout(layout);
      this.cropperView.canvas.renderAll();
    } else if (this.mode === MODE.CROPPING) {
      this.applyPictureHandleToPicture();
      this.cropperView.canvas.renderAll();
    }
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
