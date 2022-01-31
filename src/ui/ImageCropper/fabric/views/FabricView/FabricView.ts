import { fabric } from 'fabric';

import { Layout, Position } from '../../types';

export abstract class FabricView {

  abstract get object(): fabric.Object

  getLayout(): Layout {
    const width = this.object.get('width') || 0;
    const height = this.object.get('height') || 0;
    const top = this.object.get('top') || 0;
    const left = this.object.get('left') || 0;
    const scaleX = this.object.get('scaleX') || 0;
    const scaleY = this.object.get('scaleY') || 0;

    return {
      width,
      height,
      top,
      left,
      scaleX,
      scaleY,
    };
  }

  getAbsoluteLayout(): Layout {
    const layout = this.getLayout();
    const width = layout.width * layout.scaleX;
    const height = layout.height * layout.scaleY;

    return {
      top: layout.top,
      left: layout.left,
      width,
      height,
      scaleX: 1,
      scaleY: 1,
    };
  }

  getPosition():Position {
    return {
      top: this.object.get('top') || 0,
      left: this.object.get('left') || 0,
    };
  }

  setPosition(position: Position) {
    this.object.set(position);
  }

}
