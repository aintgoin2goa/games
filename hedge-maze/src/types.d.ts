import debug from "debug";

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
  cats: number;
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
