import React, { useRef } from 'react';
import invariant from 'invariant';

import { Button } from '../';

import './ImageButton.css';

type Props = {
  onLoad: (image: string) => void,
};

const emptyInputElement =  document.createElement('input');
const emptyFileReader =  new FileReader();

export const ImageButton: React.FC<Props> = ({ onLoad }) => {
  const fileInput = useRef<HTMLInputElement>(emptyInputElement);
  const fileReader = useRef<FileReader>(emptyFileReader);
  const triggerFileInput = () => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    fileInput.current.dispatchEvent(event);
  };

  const loadImage = () => {
    const { files } = fileInput.current;

    if (files && files[0]) {
      fileReader.current = new FileReader();

      fileReader.current.onload = function (event) {
        const readerChanged = !event.target || event.target !== fileReader.current;

        if (readerChanged) {
          return;
        }

        invariant(typeof event.target?.result === 'string', 'Should load image as data URL');
        onLoad(event.target.result);
      };

      fileReader.current.readAsDataURL(files[0]);
    }
  };

  return (
    <>
      <Button onClick={triggerFileInput}>
        Load image
      </Button>
      <input
        className='file-input'
        type='file'
        ref={fileInput}
        onChange={loadImage}
        accept=".jpg, .jpeg, .png, .gif"
      />
    </>
  );
};
