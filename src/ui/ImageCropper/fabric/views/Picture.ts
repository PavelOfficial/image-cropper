import { fabric } from 'fabric';
import invariant from "invariant";

import { Layout } from '../types';

type Options = {
  cornerStyle: 'rect' | 'circle' | undefined,
  cornerSize: number,
  cornerColor: string,
  transparentCorners: boolean,
  cornerStrokeColor: string,

  hasBorders: boolean,
  hasRotatingPoint: boolean,
  lockMovementX: boolean,
  lockMovementY: boolean,
  lockRotation: boolean,
  lockScalingX: boolean,
  lockScalingY: boolean,
  lockUniScaling: boolean,
  lockSkewingX: boolean,
  lockSkewingY: boolean,
  lockScalingFlip: boolean,
}

export class Picture {

  controlsVisibility = {
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

  options: Options = {
    cornerStyle: 'circle',
    cornerSize: 10,
    cornerColor: '#ffffff',
    transparentCorners: false,
    cornerStrokeColor: '#000000',

    hasBorders: false,
    hasRotatingPoint: false,
    lockMovementX: false,
    lockMovementY: false,
    lockRotation: true,
    lockScalingX: false,
    lockScalingY: false,
    lockUniScaling: true,
    lockSkewingX: false,
    lockSkewingY: false,
    lockScalingFlip: true,
  };

  image: fabric.Image;

  constructor(image: fabric.Image) {
    this.image = image;
    this.image.set(this.options);
    this.image.setControlsVisibility(this.controlsVisibility);
  }

  setLayout(options: Layout) {
    this.image.set(options);
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
