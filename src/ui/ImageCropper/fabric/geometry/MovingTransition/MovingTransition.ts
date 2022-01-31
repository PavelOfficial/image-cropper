import { FabricView } from '../../views/FabricView';
import { Position } from '../../types';

export class MovingTransition {

  startPosition: Position;

  targetStartPosition: Position;

  constructor(
    private _target: FabricView,
    private _origin: FabricView,
  ) {
    this.startPosition = this._origin.getPosition();
    this.targetStartPosition = this._target.getPosition()
  }

  translate() {
    const originPosition = this._origin.getPosition();
    const moving = {
      top: originPosition.top - this.startPosition.top,
      left: originPosition.left - this.startPosition.left,
    };

    this._origin.setPosition(this.startPosition);
    this._target.setPosition({
      top: this.targetStartPosition.top + moving.top,
      left: this.targetStartPosition.left + moving.left,
    });
  }

}
