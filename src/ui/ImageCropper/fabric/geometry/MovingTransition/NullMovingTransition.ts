import { MovingTransition } from './MovingTransition'
import { NullFabricView } from '../../views/FabricView';

export class NullMovingTransition extends MovingTransition {

  constructor() {
    super(new NullFabricView(), new NullFabricView());
  }
}
