import { fabric } from 'fabric';

import { Layout, Size } from '../types';

export class CropArea {

  rect: fabric.Rect;

  constructor() {
    this.rect = new fabric.Rect({});
  }

  normalizeLayout(layout: Layout, pictureSize: Size) {
    const width = layout.width;
    const height = layout.height;

    return {
      left: layout.left - (pictureSize.width / 2),
      top: layout.top - (pictureSize.height / 2),
      width: width,
      height: height,
      scaleX: 1,
      scaleY: 1,
    };
  }

  setLayout(layout: Layout, pictureSize: Size) {
    layout = this.normalizeLayout(layout, pictureSize);
    this.rect.set(layout);
  }

  getLayout() {
    return {
      width: this.rect.get('width') || 0,
      height: this.rect.get('height') || 0,
      top: this.rect.get('top') || 0,
      left: this.rect.get('left') || 0,
      scaleX: this.rect.get('scaleX') || 0,
      scaleY: this.rect.get('scaleY') || 0,
    };
  }

  getRect() {
    return this.rect;
  }

}
