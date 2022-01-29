import React from 'react';

import { ImageCropper } from '../ImageCropper';

import './App.css';

export const App = () => {
  return (
    <div className="App">
      <div>
        <div>
          <h3>Image cropper</h3>
        </div>
        <ImageCropper />
      </div>
    </div>
  );
}
