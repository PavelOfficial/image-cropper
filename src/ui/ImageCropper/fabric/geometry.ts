import { Layout, Size } from './types';

const getScale = (container: Size, object: Size, padding: number) => {
  const axisPadding = 2 * padding;
  const scaleX = (container.width - axisPadding) / object.width;
  const scaleY = (container.height - axisPadding) / object.height;

  return Math.min(scaleX, scaleY);
};

const fitToCenter = (container: Size, object: Size, padding: number): Layout => {
  const scale = getScale(container, object, padding);
  const width = object.width * scale;
  const height = object.height * scale;
  const freeSpaceX = (container.width - width);
  const freeSpaceY = (container.height - height);

  return {
    width: object.width,
    height: object.height,
    top: freeSpaceY / 2,
    left: freeSpaceX / 2,
    scaleX: scale,
    scaleY: scale,
  };
};

export const geometry = {
  fitToCenter,
};
