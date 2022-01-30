import { fabric } from 'fabric';

import { Layout } from '../types';

export class CropArea {

  rect: fabric.Rect;

  constructor() {
    this.rect = new fabric.Rect({});
  }

  normalizeLayout(layout: Layout) {
    const width = layout.width;
    const height = layout.height;

    return {
      left: -(layout.width / 2),
      top: -(layout.height / 2),
      width: width,
      height: height,
      scaleX: 1,
      scaleY: 1,
    };
  }

  setLayout(layout: Layout) {
    layout = this.normalizeLayout(layout);
    this.rect.set(layout);
  }

  getRect() {
    return this.rect;
  }

}
