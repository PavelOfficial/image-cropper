import { fabric } from 'fabric';

import { Picture } from './Picture';
import { geometry } from '../geometry';
import { CropArea } from './CropArea';

const emptyImage = new fabric.Image('');
const emptyPicture = new Picture(emptyImage);
const emptyCropArea = new CropArea();

export class CropperView {

  picture = emptyPicture;

  cropArea = emptyCropArea;

  canvas: fabric.Canvas;

  padding = 50;

  width = 800;

  height = 600;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new fabric.Canvas(canvas, {
      width: this.width,
      height: this.height,
    });
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

  getCropArea(picture: Picture) {
    const layout = picture.getLayout();
    const cropArea = new CropArea();

    cropArea.setLayout(layout);

    return cropArea;
  }

  updatePicture(picture: Picture) {
    this.canvas.remove(this.picture.getImage());
    this.picture = picture;
    this.canvas.add(picture.getImage());
  }

  updateCropArea(cropArea: CropArea) {
    this.canvas.remove(this.cropArea.getRect());
    this.cropArea = cropArea;
    this.canvas.add(this.cropArea.getRect());
  }

  setPicture(picture: Picture) {
    picture = this.fitToCanvasCenter(picture);
    const cropArea =  this.getCropArea(picture);

    this.updatePicture(picture);
    this.updateCropArea(cropArea);
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

