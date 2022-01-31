import { fabric } from 'fabric';

import { Layout, Size } from '../types';
import { FabricView } from './FabricView';

export class CropArea extends FabricView {

  rect: fabric.Rect;

  constructor() {
    super();
    this.rect = new fabric.Rect({});
  }

  get object() {
    return this.rect;
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

  getRect() {
    return this.rect;
  }

}
