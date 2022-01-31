import { fabric } from 'fabric';

import { FabricView } from './FabricView';

export class NullFabricView extends FabricView {

  get object() {
    return new fabric.Object();
  }

}
