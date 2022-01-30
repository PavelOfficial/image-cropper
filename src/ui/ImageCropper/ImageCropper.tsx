import React, { useEffect, useRef } from 'react';

import { ImageButton } from '../components';
import { CropperController } from './fabric/controller';

import './ImageCropper.css';

const emptyCanvasElement = document.createElement('canvas');
const emptyImageCropperController = new CropperController(emptyCanvasElement);

export const ImageCropper = () => {
  const controller = useRef<CropperController>(emptyImageCropperController);
  const canvas = useRef<HTMLCanvasElement>(emptyCanvasElement);
  const handleLoad = (image: string) => {
    controller.current.newImage(image);
  };

  useEffect(() => {
    controller.current = new CropperController(canvas.current);

    return () => {
      controller.current.unsubscribe();
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


