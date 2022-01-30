
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

export type Layout = Position & Scale & Size;
