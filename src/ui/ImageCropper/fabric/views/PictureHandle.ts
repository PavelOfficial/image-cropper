import { fabric } from 'fabric';

import { Layout, MODE, Position } from '../types';
import { DEFAULT_MODE } from '../definitions';

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
};

type ModeOptions = {
  [MODE.DRAGGING]: Options,
  [MODE.CROPPING]: Options,
};

export class PictureHandle {

  static options: ModeOptions = {
    [MODE.DRAGGING]: {
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
    },
    [MODE.CROPPING]: {
      cornerStyle: 'rect',
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
    },
  };

  static controlsVisibility = {
    [MODE.DRAGGING]: {
      'bl': true,
      'br': true,
      'tl': true,
      'tr': true,
      'mb': false,
      'ml': false,
      'mr': false,
      'mt': false,
      'mtr': false,
    },
    [MODE.CROPPING]: {
      'bl': false,
      'br': false,
      'tl': false,
      'tr': false,
      'mb': true,
      'ml': true,
      'mr': true,
      'mt': true,
      'mtr': false,
    },
  };

  rect: fabric.Rect;

  mode:MODE = DEFAULT_MODE;

  constructor() {
    this.rect = new fabric.Rect({});
    this.updateRectWithMode();
  }

  updateRectWithMode() {
    this.rect = this.rect.set(PictureHandle.options[this.mode]);
    this.rect.setControlsVisibility(PictureHandle.controlsVisibility[this.mode]);
  }

  setMode(nextMode: MODE) {
    this.mode = nextMode;
    this.updateRectWithMode();
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
