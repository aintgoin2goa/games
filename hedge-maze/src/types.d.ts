export type Point = {
  row: number;
  column: number;
};

export type Size = {
  w: number;
  h: number;
};

export type Level = {
  id: number;
  name: string;
  size: Size;
  target: Point;
};
