import mazeGenerator from "./lib/maze/index";
import type { Scene } from "phaser";
import { MAP_TILES_IN_MAZE_TILE, TILEMAP_SIZE, TILE_SIZE } from "./constants";

export type Point = {
  row: number;
  column: number;
};

export type TileCoord = {
  start: number;
  mid: number;
  end: number;
};

export type Coords = {
  x: TileCoord;
  y: TileCoord;
};

export type MazeGeneratorOptions = {
  width: number;
  height: number;
  seed?: number;
  algorithm?: "HUNTANDKILL" | "DEPTHFIRST";
};

export type MazeOptions = {
  maze: MazeGeneratorOptions;
};

export type MazeCell = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  visited: boolean;
};

export type GeneratedMazeData = {
  rows: MazeCell[][];
};

export type MazeSolution = {
  toString(): string;
  toJSON(): Point[];
};

export type GeneratedMaze = {
  toString(): string;
  toJSON(): GeneratedMazeData;
  generateSolution(start: Point, end: Point): MazeSolution;
};

export class Maze {
  private scene: Scene;
  private options: MazeOptions;
  private debugActive: boolean = true;
  mazeData: GeneratedMazeData;
  private maze: GeneratedMaze;

  constructor(scene: Scene, options: MazeOptions) {
    this.scene = scene;
    this.options = options;
  }

  static load(scene: Scene) {
    scene.load.image("maze", "img/tilemap_2.png");
  }

  debug(...args) {
    this.debugActive && console.log(...args);
  }

  debugGroup(name: string, collapsed: boolean = true) {
    if (!this.debugActive) {
      return {
        log: () => {},
        end: () => {},
      };
    }

    collapsed ? console.groupCollapsed(name) : console.group(name);
    return {
      log: (...args) => console.log(...args),
      end: () => console.groupEnd(),
    };
  }

  generate() {
    this.maze = mazeGenerator(this.options.maze) as GeneratedMaze;
    this.debug(this.maze.toString());
    this.mazeData = this.maze.toJSON();
  }

  solve(start: Point, end: Point) {
    const solution = this.maze.generateSolution(start, end);
    this.debug(solution.toString());
    // this.debug(solution.toJSON());
    return solution.toJSON().map((point) => {
      return this.getTileCoords(point.column, point.row);
    });
  }

  getTileCoords(col: number, row: number): Coords {
    const tileSize = TILE_SIZE;
    const x = col * tileSize;
    const y = row * tileSize;
    const xEnd = x + tileSize;
    const yEnd = y + tileSize;
    const midX = (xEnd - x) / 2 + x;
    const midY = (yEnd - y) / 2 + y;

    return {
      x: {
        start: x,
        mid: midX,
        end: xEnd,
      },
      y: {
        start: y,
        mid: midY,
        end: yEnd,
      },
    };
  }

  isHedge(tileX, tileY) {
    const mazeCol = Math.floor(tileX / MAP_TILES_IN_MAZE_TILE);
    const mazeRow = Math.floor(tileX / MAP_TILES_IN_MAZE_TILE);
    const xPosInCell = tileX % MAP_TILES_IN_MAZE_TILE;
    const yPosInCell = tileY % MAP_TILES_IN_MAZE_TILE;
    const cell = this.mazeData.rows[mazeRow][mazeCol];
    console.log("isHedge", {
      tileX,
      tileY,
      mazeCol,
      mazeRow,
      cell,
      xPosInCell,
      yPosInCell,
    });

    if (cell.left && xPosInCell === 0) {
      console.log("LEFT");
      return true;
    }

    if (cell.up && yPosInCell === 0) {
      console.log("UP");
      return true;
    }

    if (cell.right && yPosInCell === MAP_TILES_IN_MAZE_TILE - 1) {
      console.log("RIGHT");
      return true;
    }

    if (cell.down && xPosInCell === MAP_TILES_IN_MAZE_TILE - 1) {
      console.log("DOWN");
      return true;
    }

    return false;
  }

  toTileMap() {
    const FLOOR = 0;
    const HEDGE = 1;
    const mapTilesInMazeTile = TILE_SIZE / TILEMAP_SIZE;
    const mapTilesX = mapTilesInMazeTile * this.options.maze.width;
    const mapTilesY = mapTilesInMazeTile * this.options.maze.height;
    console.log({ mapTilesX, mapTilesY });
    const map: number[][] = [];
    for (let iX = 0; iX < mapTilesX; iX++) {
      map[iX] = [];
      for (let iY = 0; iY < mapTilesY; iY++) {
        const tileIsHedge = this.isHedge(iX, iY);
        console.log("is hedge result", tileIsHedge);
        map[iX][iY] = tileIsHedge ? HEDGE : FLOOR;
      }
    }

    console.log(map);
    return map;
  }
}
