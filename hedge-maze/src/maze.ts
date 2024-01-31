import mazeGenerator from "./lib/maze/index";
import type { Scene } from "phaser";
import {
  MAP_TILES_IN_MAZE_TILE,
  TILEMAP_SIZE,
  TILE_SIZE,
} from "./lib/constants";
import { Directions, MazeCell, MazeTile, Point } from "./types";
import { clone, randomArrayIndex } from "./utils";

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

  getRandomTile(): MazeTile {
    const row = randomArrayIndex(this.mazeData.rows);
    const column = randomArrayIndex(this.mazeData.rows[row]);
    const cell = this.mazeData.rows[row][column];
    return { point: { row, column }, cell };
  }

  getNeighbouringTile(tile: MazeTile, dir: Directions): MazeTile | null {
    // cell in this direction not connected
    if (tile.cell[dir] === true) {
      return null;
    }

    // check if we're at the edge of the board
    if (
      (dir === "left" && tile.point.column === 0) ||
      (dir === "up" && tile.point.row === 0)
    ) {
      return null;
    }

    if (
      (dir === "right" &&
        tile.point.column + 1 === this.mazeData.rows[tile.point.row].length) ||
      (dir === "down" && tile.point.row + 1 === this.mazeData.rows.length)
    ) {
      return null;
    }

    let newColIndex = tile.point.column;
    let newRowIndex = tile.point.row;

    switch (dir) {
      case "left":
        newColIndex--;
        break;
      case "right":
        newColIndex++;
        break;
      case "up":
        newRowIndex--;
        break;
      case "down":
        newRowIndex++;
        break;
    }

    const cell = this.mazeData.rows[newRowIndex][newColIndex];

    return {
      point: { column: newColIndex, row: newRowIndex },
      cell,
    };
  }

  getVisibleTiles(start: MazeTile, dir: Directions): MazeTile[] {
    let current = clone(start);
    const visible = [current];
    let neighbour = this.getNeighbouringTile(current, dir);
    while (neighbour !== null) {
      current = clone(neighbour);
      visible.push(current);
      neighbour = this.getNeighbouringTile(current, dir);
    }

    console.log("getVisibleTiles", { start, visible, dir });
    return visible;
  }

  getLastVisibleTile(start: MazeTile, dir: Directions): MazeTile {
    const visible = this.getVisibleTiles(start, dir);
    return visible[visible.length - 1];
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

  getTileForCoords(x: number, y: number): MazeTile {
    const rowIndex = Math.floor(x / TILE_SIZE);
    const colIndex = Math.floor(y / TILE_SIZE);
    const cell = this.mazeData.rows[rowIndex][colIndex];
    console.log("getTileForCoords", { x, y, rowIndex, colIndex, cell });
    return {
      point: { row: rowIndex, column: colIndex },
      cell,
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
      return true;
    }

    if (cell.up && yPosInCell === 0) {
      return true;
    }

    if (cell.right && yPosInCell === MAP_TILES_IN_MAZE_TILE - 1) {
      return true;
    }

    if (cell.down && xPosInCell === MAP_TILES_IN_MAZE_TILE - 1) {
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
    const map: number[][] = [];
    for (let iX = 0; iX < mapTilesX; iX++) {
      map[iX] = [];
      for (let iY = 0; iY < mapTilesY; iY++) {
        const tileIsHedge = this.isHedge(iX, iY);
        map[iX][iY] = tileIsHedge ? HEDGE : FLOOR;
      }
    }

    console.log(map);
    return map;
  }
}
