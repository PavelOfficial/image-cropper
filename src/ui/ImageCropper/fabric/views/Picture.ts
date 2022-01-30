import { fabric } from 'fabric';
import invariant from 'invariant';

import { Layout, WORKING_MODE } from '../types';
import { CropArea } from './CropArea';

type Options = {
  cornerStyle: 'rect' | 'circle' | undefined,
  cornerSize: number,
  cornerColor: string,
  transparentCorners: boolean,
  cornerStrokeColor: string,

  hasBorders: boolean,
  lockScalingFlip: boolean,
  lockMovementX: boolean,
  lockMovementY: boolean,

  hoverCursor: string | undefined,
  moveCursor: string | undefined,

  selectable: boolean,
};

type ModeOptions = {
  [WORKING_MODE.DRAGGING]: Options,
  [WORKING_MODE.CROPPING]: Options,
};

const emptyCropArea = new CropArea();

export class Picture {

  static controlsVisibility = {
    [WORKING_MODE.DRAGGING]: {
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mb: false,
      ml: false,
      mr: false,
      mt: false,
      mtr: false,
    },
    [WORKING_MODE.CROPPING]: {
      bl: true,
      br: true,
      tl: true,
      tr: true,
      mb: false,
      ml: false,
      mr: false,
      mt: false,
      mtr: false,
    },
  };

  static options: ModeOptions = {
    [WORKING_MODE.DRAGGING]: {
      cornerStyle: 'circle',
      cornerSize: 10,
      cornerColor: '#f4fdfd',
      transparentCorners: false,
      cornerStrokeColor: '#226fd9',

      hasBorders: false,
      lockScalingFlip: true,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default',
      moveCursor: 'default',
      selectable: false,
    },
    [WORKING_MODE.CROPPING]: {
      cornerStyle: 'circle',
      cornerSize: 10,
      cornerColor: '#f4fdfd',
      transparentCorners: false,
      cornerStrokeColor: '#226fd9',

      hasBorders: true,
      lockScalingFlip: true,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: undefined,
      moveCursor: undefined,
      selectable: true,
    },
  };

  layout:Layout = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
  };

  cropArea = emptyCropArea;

  image: fabric.Image;

  mode = WORKING_MODE.DEFAULT;

  constructor(image: fabric.Image) {
    this.image = image;
    this.image.set(Picture.options[this.mode]);
    this.image.setControlsVisibility(Picture.controlsVisibility[this.mode]);
  }

  getCropArea(layout: Layout) {
    const cropArea = new CropArea();

    cropArea.setLayout(layout);

    return cropArea;
  }

  initLayout(layout: Layout) {
    this.cropArea = this.getCropArea(layout);
    this.layout = layout;
    this.image.set({
      ...layout,
      clipPath: this.cropArea.getRect(),
    });
  }

  getLayout(): Layout {
    return this.layout;
  }

  getNaturalSize() {
    const imageElement = this.image.getElement();

    invariant(imageElement instanceof HTMLImageElement, 'Image element should be a HTMLImageElement');

    return {
      width: imageElement.naturalWidth,
      height: imageElement.naturalHeight,
    };
  }

  getImage() {
    return this.image;
  }

}
