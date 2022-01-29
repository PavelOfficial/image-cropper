import React, { useEffect, useRef } from 'react';

import { ImageButton } from '../components';
import { ImageCropperController } from './ImageCropperController';

import './ImageCropper.css';

const emptyCanvasElement = document.createElement('canvas');
const emptyImageCropperController = new ImageCropperController(emptyCanvasElement);

export const ImageCropper = () => {
  const controller = useRef<ImageCropperController>(emptyImageCropperController);
  const canvas = useRef<HTMLCanvasElement>(emptyCanvasElement);
  const handleLoad = (image: string) => {
    controller.current.newImage(image);
  };

  useEffect(() => {
    controller.current = new ImageCropperController(canvas.current);

    return () => {
      controller.current.destroy();
    };
  }, []);

  return (
    <div>
      <div className="contols">
        <ImageButton
          onLoad={handleLoad}
        />
      </div>
      <div className="canvas-box">
        <canvas
          ref={canvas}
        />
      </div>
    </div>
  );
};


