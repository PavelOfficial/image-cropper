import { fabric } from 'fabric';
import invariant from 'invariant';

import { Layout, MODE, Position } from '../types';
import { CropArea } from './CropArea';
import { DEFAULT_MODE } from '../definitions';

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
  [MODE.DRAGGING]: Options,
  [MODE.CROPPING]: Options,
};

const emptyCropArea = new CropArea();

export class Picture {

  static controlsVisibility = {
    [MODE.DRAGGING]: {
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
    [MODE.CROPPING]: {
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
    [MODE.DRAGGING]: {
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
    [MODE.CROPPING]: {
      cornerStyle: 'circle',
      cornerSize: 10,
      cornerColor: '#f4fdfd',
      transparentCorners: false,
      cornerStrokeColor: '#226fd9',

      hasBorders: true,
      lockScalingFlip: true,
      lockMovementX: false,
      lockMovementY: false,
      hoverCursor: undefined,
      moveCursor: undefined,
      selectable: true,
    },
  };

  cropArea = emptyCropArea;

  image: fabric.Image;

  mode = DEFAULT_MODE;

  constructor(image: fabric.Image) {
    this.image = image;
    this.updateImageWithMode();
  }

  updateImageWithMode() {
    this.image.set(Picture.options[this.mode]);
    this.image.setControlsVisibility(Picture.controlsVisibility[this.mode]);
  }

  setMode(nextMode: MODE) {
    this.mode = nextMode;
    this.updateImageWithMode();
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
