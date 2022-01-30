import {fabric} from "fabric";
import invariant from "invariant";

export class ImageLoader {

  lastSrcImage = '';

  checkLastSrcImage(srcImage: string) {
    if (srcImage === this.lastSrcImage) {
      this.lastSrcImage = '';

      return true;
    }

    return false;
  }

  handleImageLoaded(srcImage: string, image: fabric.Image) {
    invariant(this.checkLastSrcImage(srcImage), 'Image should agree with its src image');

    const imageElement = image.getElement();

    invariant(imageElement instanceof HTMLImageElement, 'Image element should be a HTMLImageElement');

    return image;
  };

  load(imageSrc: string): Promise<fabric.Image> {
    this.lastSrcImage = imageSrc;

    return new Promise((resolve, reject) => {
      const handleImageLoaded = this.handleImageLoaded.bind(this, imageSrc);
      fabric.Image.fromURL(imageSrc, (image: fabric.Image) => {
        try {
          const result = handleImageLoaded(image);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

}
