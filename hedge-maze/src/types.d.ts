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
  point: Point;
  cell: MazeCell;
};

export type Directions = "up" | "down" | "left" | "right";
