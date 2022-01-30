import { fabric } from 'fabric';

import { Layout } from '../types';

type Options = {
  cornerStyle: 'circle' | 'rect' | undefined,
  cornerSize: number,
  cornerColor: string,
  transparentCorners: boolean,
  cornerStrokeColor: string,

  hasBorders: boolean,
  backgroundColor: string,
  borderColor: string,
  strokeWidth: number,
  stroke: string,
  fill: string,
}

export class CropArea {

  rect: fabric.Rect;

  options: Options = {
    cornerStyle: 'rect',
    cornerSize: 10,
    cornerColor: '#f4fdfd',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    transparentCorners: false,
    cornerStrokeColor: '#226fd9',

    hasBorders: false,
    borderColor: '#1456b6',
    stroke: '#1456b6',
    strokeWidth: 2,
    fill: 'none',
  }

  controlsVisibility = {
    'bl': false,
    'br': false,
    'tl': false,
    'tr': false,
    'mb': true,
    'ml': true,
    'mr': true,
    'mt': true,
    'mtr': false,
  };

  constructor() {
    this.rect = new fabric.Rect({
      ...this.options,
    });

    this.rect.setControlsVisibility(this.controlsVisibility);
  }

  normalizeLayout(layout: Layout) {
    const width = layout.width * layout.scaleX - this.options.strokeWidth;
    const height = layout.height * layout.scaleY - this.options.strokeWidth;

    return {
      ...layout,
      width,
      height,
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
