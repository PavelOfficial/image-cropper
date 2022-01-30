import { fabric } from 'fabric';
import { Layout, Position } from '../types';

type Options = {
  cornerStyle: 'circle' | 'rect' | undefined,
  cornerSize: number,
  cornerColor: string,
  transparentCorners: boolean,
  cornerStrokeColor: string,
  lockScalingFlip: boolean,
  noScaleCache: boolean,
  strokeUniform: boolean,

  hasBorders: boolean,
  strokeWidth: number,
  stroke: string,
  fill: string,
}

export class PictureHandle {

  rect: fabric.Rect;

  static options: Options = {
    cornerStyle: 'circle',
    cornerSize: 10,
    cornerColor: '#f4fdfd',
    transparentCorners: false,
    cornerStrokeColor: '#226fd9',
    lockScalingFlip: true,
    strokeUniform: true,
    noScaleCache: true,

    hasBorders: false,
    stroke: '#1456b6',
    strokeWidth: 2,
    fill:'transparent',
  };

  static controlsVisibility = {
    'bl': true,
    'br': true,
    'tl': true,
    'tr': true,
    'mb': false,
    'ml': false,
    'mr': false,
    'mt': false,
    'mtr': false,
  };

  constructor() {
    this.rect = new fabric.Rect(PictureHandle.options);
    this.rect.setControlsVisibility(PictureHandle.controlsVisibility);
  }

  getRect() {
    return this.rect;
  }

  normalizeLayout(layout: Layout) {
    return {
      ...layout,
      width: layout.width * layout.scaleX,
      height: layout.height * layout.scaleY,
      scaleX: 1,
      scaleY: 1,
    };
  }

  setLayout(layout: Layout) {
    layout = this.normalizeLayout(layout);

    this.rect.set(layout);
  }

  getLayout(): Layout {
    return {
      width: this.rect.get('width') || 0,
      height: this.rect.get('height') || 0,
      top: this.rect.get('top') || 0,
      left: this.rect.get('left') || 0,
      scaleX: this.rect.get('scaleX') || 1,
      scaleY: this.rect.get('scaleY') || 1,
    };
  }

  getPosition(): Position {
    return {
      top: this.rect.get('top') || 0,
      left: this.rect.get('left') || 0,
    };
  }

}
