import debug from "debug";

export type TargetPoint = {
  x: number;
  y: number;
};

export type Point = {
  row: number;
  column: number;
};

export type Size = {
  w: number;
  h: number;
};

export type Cat = {
  start: Point;
};

export type Level = {
  id: number;
  name: string;
  size: Size;
  target: Point;
  cats: Cat[];
  mapZoomLevel: number;
};

export type MazeCell = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  visited: boolean;
};

export type MazeTile = {
  id: string;
  point: Point;
  cell: MazeCell;
  hasRat?: boolean;
};

export type Directions = "up" | "down" | "left" | "right";

export type Debugger = ReturnType<typeof debug>;
export type DebuggerCollection<T extends string> = Record<T, Debugger>;
