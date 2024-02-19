import { Scene } from "phaser";
import { Maze } from "./maze";
import { MAP_TILES_IN_MAZE_TILE, TILEMAP_SIZE } from "./lib/constants";
import { MazeCell } from "./types";
import { EventNames, subscribe } from "./lib/events";

export type TileCoord = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
};

export enum Tiles {
  FLOOR = 1,
  HEDGE = 0,
}

const KEY = "maze";
const FILE = '"img/tilemap_2.png';

type Size = {
  w: number;
  h: number;
};

export class TileMap {
  scene: Scene;
  maze: Maze;
  map: Phaser.Tilemaps.Tilemap;
  layer: Phaser.Tilemaps.TilemapLayer;
  tiles: Phaser.Tilemaps.Tileset;

  data: Map<string, Tiles>;

  size: Size;

  constructor(scene: Scene, maze: Maze, size: Size) {
    this.scene = scene;
    this.maze = maze;
    this.size = size;
    this.data = new Map();
    this.buildData();
    const tileMapData = this.getTileMapData();
    this.map = scene.make.tilemap({
      data: tileMapData,
      tileWidth: TILEMAP_SIZE,
      tileHeight: TILEMAP_SIZE,
    });
    this.tiles = this.map.addTilesetImage(KEY)!;
    this.layer = this.map.createLayer(0, this.tiles, 0, 0)!;
    this.map.setCollision(Tiles.HEDGE);
    subscribe(EventNames.TARGET_REACHED, () => this.revealExit());
  }

  static load(scene: Scene) {
    scene.load.image(KEY, FILE);
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
    const xMax = this.size.w * MAP_TILES_IN_MAZE_TILE;
    const yMax = this.size.h * MAP_TILES_IN_MAZE_TILE;

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

  revealExit() {
    const tiles: Phaser.Tilemaps.Tile[] = [];
    for (let i = 1; i < MAP_TILES_IN_MAZE_TILE; i++) {
      tiles.push(this.map.getTileAt(0, i, true)!);
    }
    this.map.removeTile(tiles, Tiles.FLOOR, true);
    this.map.setCollision(Tiles.HEDGE);
  }
}
