import { Scene } from "phaser";
import { Maze, MazeCell } from "./maze";
import {
  MAP_TILES_IN_MAZE_TILE,
  SIZE_X,
  SIZE_Y,
  TILEMAP_SIZE,
} from "./lib/constants";

export type TileCoord = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
};

export enum Tiles {
  FLOOR = 0,
  HEDGE = 1,
}

const KEY = "maze";
const FILE = '"img/tilemap_2.png';

export class TileMap {
  scene: Scene;
  maze: Maze;
  map: Phaser.Tilemaps.Tilemap;
  layer: Phaser.Tilemaps.TilemapLayer;

  data: Map<string, Tiles>;

  constructor(scene: Scene, maze: Maze) {
    this.scene = scene;
    this.maze = maze;
    this.data = new Map();
    this.buildData();
    const tileMapData = this.getTileMapData();
    this.map = scene.make.tilemap({
      data: tileMapData,
      tileWidth: TILEMAP_SIZE,
      tileHeight: TILEMAP_SIZE,
    });
    const tiles = this.map.addTilesetImage(KEY);
    this.layer = this.map.createLayer(0, tiles!, 0, 0)!;
    this.map.setCollision(1);
  }

  getCoordsForTile(rowIndex: number, colIndex: number): TileCoord {
    const xStart = colIndex * MAP_TILES_IN_MAZE_TILE;
    const xEnd = xStart + MAP_TILES_IN_MAZE_TILE;
    const yStart = rowIndex * MAP_TILES_IN_MAZE_TILE;
    const yEnd = yStart + MAP_TILES_IN_MAZE_TILE;
    return { xStart, xEnd, yStart, yEnd };
  }

  getTileType(cell: MazeCell, x: number, y: number): Tiles {
    const xInCell = x % MAP_TILES_IN_MAZE_TILE;
    const yInCell = y % MAP_TILES_IN_MAZE_TILE;
    if (cell.up && yInCell === 0) {
      return Tiles.HEDGE;
    }

    if (cell.left && xInCell === 0) {
      return Tiles.HEDGE;
    }

    if (cell.down && yInCell === MAP_TILES_IN_MAZE_TILE - 1) {
      return Tiles.HEDGE;
    }

    if (cell.right && xInCell === MAP_TILES_IN_MAZE_TILE - 1) {
      return Tiles.HEDGE;
    }

    return Tiles.FLOOR;
  }

  buildData() {
    this.maze.mazeData.rows.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const { xStart, xEnd, yStart, yEnd } = this.getCoordsForTile(
          rowIndex,
          colIndex
        );

        for (let x = xStart; x < xEnd; x++) {
          for (let y = yStart; y < yEnd; y++) {
            this.data.set(`${y}:${x}`, this.getTileType(col, x, y));
          }
        }
      });
    });
  }

  getTileMapData(): Tiles[][] {
    const tileMapData: Tiles[][] = [];
    const xMax = SIZE_X * MAP_TILES_IN_MAZE_TILE;
    const yMax = SIZE_Y * MAP_TILES_IN_MAZE_TILE;
    console.log({ xMax, yMax });

    for (let y = 0; y < yMax; y++) {
      tileMapData[y] = [];
      for (let x = 0; x < xMax; x++) {
        const tile = this.data.get(`${y}:${x}`);
        if (tile === undefined) {
          throw new Error(`No tile found for x=${x} y=${y}`);
        }
        tileMapData[y][x] = tile;
      }
    }
    return tileMapData;
  }

  static load(scene: Scene) {
    scene.load.image(KEY, FILE);
  }
}
