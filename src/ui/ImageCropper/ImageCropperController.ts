import { fabric } from 'fabric';
import invariant from "invariant";

export class ImageCropperController {

  lastSrcImage = '';

  canvas: fabric.Canvas;

  image: fabric.Image|null = null;

  crop: fabric.Image| null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new fabric.Canvas(canvas);
  }

  destroy() {

  }

  checkLastSrcImage(srcImage: string) {
    if (srcImage === this.lastSrcImage) {
      this.lastSrcImage = '';

      return true;
    }

    return false;
  }

  handleImageLoaded(srcImage: string, image: fabric.Image) {
    if (!this.checkLastSrcImage(srcImage)) {
      return;
    }

    if (this.image) {
      this.canvas.remove(this.image);
    }

    const imageElement = image.getElement();

    invariant(imageElement instanceof HTMLImageElement, 'Image element should be a HTMLImageElement');

    // imageElement.naturalHeight;
    const width = 100;
    const height = 100;

    image.set({
      left: 0,
      top: 0,
      width: imageElement.naturalWidth,
      height: imageElement.naturalHeight,
      scaleX: 0.2,
      scaleY: 0.2,
      hasRotatingPoint: false,
      hasBorders: false,
      lockRotation: true,
      lockUniScaling: true,
      /*
      skewX: width / imageElement.naturalWidth,
      skewY: height / imageElement.naturalHeight,
       */
    });

    this.image = image;
    this.canvas.add(this.image);
  };

  newImage(image: string) {
    this.lastSrcImage = image;

    const handleImageLoaded = this.handleImageLoaded.bind(this, image);
    fabric.Image.fromURL(image, handleImageLoaded);
  }

}
