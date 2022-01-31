import { fabric } from 'fabric';

import { Layout, MODE, Position } from '../types';
import { DEFAULT_MODE } from '../definitions';
import { FabricView } from './FabricView';

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

export class PictureHandle extends FabricView {

  static options: ModeOptions = {
    [MODE.DRAGGING]: {
      cornerStyle: 'circle',
      cornerSize: 10,
      cornerColor: '#f4fdfd',
      transparentCorners: false,
      cornerStrokeColor: '#226fd9',
      lockScalingFlip: true,
      strokeUniform: true,
      noScaleCache: false,

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
      noScaleCache: false,

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

  lastLayout: Layout = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scaleX: 0,
    scaleY: 0,
  };

  rect: fabric.Rect;

  mode:MODE = DEFAULT_MODE;

  constructor() {
    super();
    this.rect = new fabric.Rect({});
    this.updateRectWithMode();
  }

  get object() {
    return this.rect;
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

  terminateScale(boxAbsoluteLayout: Layout) {
    const handleAbsoluteLayout = this.getAbsoluteLayout();
    let top = handleAbsoluteLayout.top;
    let left = handleAbsoluteLayout.left;
    let width = handleAbsoluteLayout.width;
    let height = handleAbsoluteLayout.height;
    const bottom = handleAbsoluteLayout.top + handleAbsoluteLayout.height;
    const right = handleAbsoluteLayout.left + handleAbsoluteLayout.width;
    const boxAbsoluteLayoutBottom = boxAbsoluteLayout.top + boxAbsoluteLayout.height;
    const boxAbsoluteLayoutRight = boxAbsoluteLayout.left + boxAbsoluteLayout.width;

    if (handleAbsoluteLayout.top < boxAbsoluteLayout.top) {
      height = bottom - boxAbsoluteLayout.top;
      top = boxAbsoluteLayout.top;
    }

    if (handleAbsoluteLayout.left < boxAbsoluteLayout.left) {
      width = right - boxAbsoluteLayout.left;
      left = boxAbsoluteLayout.left;
    }

    if (bottom > boxAbsoluteLayoutBottom) {
      height = boxAbsoluteLayoutBottom - handleAbsoluteLayout.top;
    }

    if (right > boxAbsoluteLayoutRight) {
      width = boxAbsoluteLayoutRight - handleAbsoluteLayout.left;
    }

    this.setLayout({
      ...handleAbsoluteLayout,
      top,
      left,
      width,
      height,
      scaleX: 1,
      scaleY: 1,
    });
  }

  terminateMove(boxAbsoluteLayout: Layout) {
    const handleAbsoluteLayout = this.getAbsoluteLayout();

    let top = handleAbsoluteLayout.top;
    let left = handleAbsoluteLayout.left;
    const bottom = handleAbsoluteLayout.top + handleAbsoluteLayout.height;
    const right = handleAbsoluteLayout.left + handleAbsoluteLayout.width;
    const boxAbsoluteLayoutBottom = boxAbsoluteLayout.top + boxAbsoluteLayout.height;
    const boxAbsoluteLayoutRight = boxAbsoluteLayout.left + boxAbsoluteLayout.width;

    if (handleAbsoluteLayout.top < boxAbsoluteLayout.top) {
      top = boxAbsoluteLayout.top;
    }

    if (handleAbsoluteLayout.left < boxAbsoluteLayout.left) {
      left = boxAbsoluteLayout.left;
    }

    if (bottom > boxAbsoluteLayoutBottom) {
      top = boxAbsoluteLayoutBottom - handleAbsoluteLayout.height;
    }

    if (right > boxAbsoluteLayoutRight) {
      left = boxAbsoluteLayoutRight - handleAbsoluteLayout.width;
    }

    this.setLayout({
      ...handleAbsoluteLayout,
      top,
      left,
    });
  }

  setPosition(position: Position) {
    this.rect.set(position);
  }

}
