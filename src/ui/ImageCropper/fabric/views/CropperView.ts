import { fabric } from 'fabric';

import { Picture } from './Picture';
import { geometry } from '../geometry';
import { PictureHandle } from './PictureHandle';

type FabricHandler = (event: fabric.IEvent<Event>) => void;

const emptyImage = new fabric.Image('');
const emptyPicture = new Picture(emptyImage);
const pictureHandle = new PictureHandle();
const emptyOnDragOver: FabricHandler = () => undefined;

export class CropperView {

  pictureHandle: PictureHandle = pictureHandle;

  picture: Picture = emptyPicture;

  canvas: fabric.Canvas;

  padding = 50;

  width = 800;

  height = 600;

  _onDragOver: FabricHandler = emptyOnDragOver;

  onUpdate = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new fabric.Canvas(canvas, {
      width: this.width,
      height: this.height,
    });
  }

  set onDragOver(handleDragOver: FabricHandler) {
    if (handleDragOver) {
      this._onDragOver = handleDragOver;
      this.canvas.on('dragover', this._onDragOver);
    } else {
      this.canvas.off('dragover', this._onDragOver);
    }
  }


  get size() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  fitToCanvasCenter(picture: Picture) {
    const layout = geometry.fitToCenter(this.size, picture.getNaturalSize(), this.padding);

    picture.setLayout(layout);

    return picture;
  }

  updatePicture(picture: Picture) {
    this.canvas.remove(this.picture.getImage());
    this.picture = picture;
    this.canvas.add(picture.getImage());
  }

  updatePictureHandle(pictureHandle: PictureHandle) {
    this.canvas.remove(this.pictureHandle.getRect());
    this.pictureHandle = pictureHandle;
    this.canvas.add(pictureHandle.getRect());
  }

  setPicture(picture: Picture) {
    picture = this.fitToCanvasCenter(picture);

    const pictureHandle = new PictureHandle();

    pictureHandle.setLayout(picture.getLayout());

    this.updatePicture(picture);
    this.updatePictureHandle(pictureHandle);
    this.onUpdate();
  }

  setPictureImage(image: fabric.Image) {
    const picture = new Picture(image);

    this.setPicture(picture);
  }

}

/*

handleDblclick = (event: IEvent<MouseEvent>) => {
  if (event.target === this.image) {
    this.setCropEditing(!this.cropEditing);
    console.log('image clicked !!!');
  }

  /*
    setTimeout(() => {
      if (this.image) {
        this.canvas.setActiveObject(this.image);
        this.canvas.renderAll(); // Use canvas render all for to update selection
      }
    }, 500);
   */

  // setTimeout(() => {
  //   if (this.image) {
  //     this.canvas.getObjects().forEach((o) => {
  //       this.canvas.setActiveObject(o);
  //     });
  //     /*
  //       this.canvas.setActiveObject(o);
  //       this.canvas.setActiveObject(this.image);
  //      */
  //     // this.canvas.setActiveObject(this.canvas.item(0));
  //   }
  // }, 500);
// }

