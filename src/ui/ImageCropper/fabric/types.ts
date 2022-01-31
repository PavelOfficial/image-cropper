
export type Size = {
  width: number;
  height: number;
};

export type Position = {
  top: number;
  left: number;
};

export type Scale = {
  scaleX: number;
  scaleY: number;
};

export enum MODE {
  DRAGGING = 'DRAGGING',
  CROPPING = 'CROPPING',
}

export type Layout = Position & Scale & Size;
