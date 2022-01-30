import { fabric } from 'fabric';

import { Picture } from './Picture';
import { geometry } from '../geometry';

const emptyImage = new fabric.Image('');
const emptyPicture = new Picture(emptyImage);

export class CropperCanvas {

  picture = emptyPicture;

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

  setPicture(picture: Picture) {
    this.canvas.remove(this.picture.getImage());
    this.picture = this.fitToCanvasCenter(picture);
    this.canvas.add(this.picture.getImage());
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

