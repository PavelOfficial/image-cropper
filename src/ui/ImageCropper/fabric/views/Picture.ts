import { fabric } from 'fabric';
import invariant from 'invariant';

import { Layout, WORKING_MODE, Position } from '../types';
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

  cropArea = emptyCropArea;

  image: fabric.Image;

  mode = WORKING_MODE.DEFAULT;

  constructor(image: fabric.Image) {
    this.image = image;
    this.image.set(Picture.options[this.mode]);
    this.image.setControlsVisibility(Picture.controlsVisibility[this.mode]);
  }

  setPosition(position: Position) {
    this.image.set(position);
  }

  getCropArea(layout: Layout) {
    const cropArea = new CropArea();

    cropArea.setLayout(layout);

    return cropArea;
  }

  initLayout(layout: Layout) {
    this.cropArea = this.getCropArea(layout);
    this.image.set({
      ...layout,
      clipPath: this.cropArea.getRect(),
    });
  }

  normalizeLayout(layout: Layout) {
    const width = layout.width * layout.scaleX;
    const height = layout.height * layout.scaleY;

    const currentLayout = this.getLayout();
    const currentWidth = currentLayout.width;
    const currentHeight = currentLayout.height;

    const scaleX = width / currentLayout.width;
    const scaleY = height / currentLayout.height;

    return {
      ...layout,
      width: currentWidth,
      height: currentHeight,
      scaleX,
      scaleY,
    };
  }

  getLayout(): Layout {
    return {
      width: this.image.get('width') || 0,
      height: this.image.get('height') || 0,
      top: this.image.get('top') || 0,
      left: this.image.get('left') || 0,
      scaleX: this.image.get('scaleX') || 1,
      scaleY: this.image.get('scaleY') || 1,
    };
  }

  setLayout(layout: Layout) {
    layout = this.normalizeLayout(layout);
    this.image.set({
      ...layout,
    });
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
