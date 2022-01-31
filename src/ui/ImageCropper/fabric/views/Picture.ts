import { fabric } from 'fabric';
import invariant from 'invariant';

import { Layout, MODE, Position } from '../types';
import { CropArea } from './CropArea';
import { DEFAULT_MODE } from '../definitions';
import { FabricView } from './FabricView';

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

export class Picture extends FabricView {

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
    super();
    this.image = image;
    this.updateImageWithMode();
  }

  get object() {
    return this.image;
  }

  updateImageWithMode() {
    this.image.set({
      ...Picture.options[this.mode],
      clipPath: this.getClipPath(),
    });

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

    cropArea.setLayout({
      ...layout,
      top: 0,
      left: 0,
    }, {
      width: layout.width,
      height: layout.height,
    });

    return cropArea;
  }

  getClipPath() {
    if (this.mode === MODE.DRAGGING) {
      return this.cropArea.getRect();
    } else if (this.mode === MODE.CROPPING) {
      return undefined;
    }
  }

  initLayout(layout: Layout) {
    this.cropArea = this.getCropArea(layout);
    this.setLayout(layout);
  }

  setLayout(layout: Layout) {
    this.image.set({
      ...layout,
      clipPath: this.getClipPath(),
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

  transformWithClipLayout(layout: Layout) {
    const pictureLayout = this.getLayout();
    const cropLayout = this.cropArea.getLayout();
    const absoluteClip = {
      width: (cropLayout.width * cropLayout.scaleX) * pictureLayout.scaleX,
      height: (cropLayout.height * cropLayout.scaleY) * pictureLayout.scaleY,
      left: pictureLayout.left + (pictureLayout.scaleX * ((pictureLayout.width / 2) + cropLayout.left)),
      top: pictureLayout.top + (pictureLayout.scaleY * ((pictureLayout.height / 2) + cropLayout.top)),
    };

    const deltaLeft = layout.left - absoluteClip.left;
    const deltaTop = layout.top - absoluteClip.top;
    const absoluteLayout = {
      width: layout.width * layout.scaleX,
      height: layout.height * layout.scaleY,
    };

    this.setLayout({
      ...pictureLayout,
      top: pictureLayout.top + deltaTop,
      left: pictureLayout.left + deltaLeft,
      scaleX: absoluteLayout.width / cropLayout.width,
      scaleY: absoluteLayout.height / cropLayout.height,
    });
  }

  setClipLayout(clipLayout: Layout) {
    const pictureLayout = this.getLayout();
    const absolutePictureLayout = {
      top: pictureLayout.top,
      left: pictureLayout.left,
      width: pictureLayout.width * pictureLayout.scaleX,
      height: pictureLayout.height * pictureLayout.scaleY,
    };

    const absoluteClipLayout = {
      top: clipLayout.top,
      left: clipLayout.left,
      width: clipLayout.width * clipLayout.scaleX,
      height: clipLayout.height * clipLayout.scaleY,
    };

    this.cropArea.setLayout({
      width: (absoluteClipLayout.width / absolutePictureLayout.width) * pictureLayout.width,
      height: (absoluteClipLayout.height / absolutePictureLayout.height) * pictureLayout.height,
      top: (absoluteClipLayout.top - absolutePictureLayout.top) / pictureLayout.scaleY,
      left: (absoluteClipLayout.left - absolutePictureLayout.left) / pictureLayout.scaleX,
      scaleX: 1,
      scaleY: 1,
    }, {
      width: pictureLayout.width,
      height: pictureLayout.height,
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
