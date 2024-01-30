import { Level } from "../types";

export const WIDTH = 800;
export const HEIGHT = 600;

export const TILE_SIZE = 400;
export const TILEMAP_SIZE = 100;
export const MAP_TILES_IN_MAZE_TILE = TILE_SIZE / TILEMAP_SIZE;

export const Levels: Level[] = [
  {
    id: 0,
    name: "Level One",
    size: {
      w: 4,
      h: 4,
    },
    target: {
      row: 2,
      column: 2,
    },
  },
  {
    id: 1,
    name: "Level Two",
    size: {
      w: 8,
      h: 8,
    },
    target: {
      row: 4,
      column: 4,
    },
  },
  {
    id: 1,
    name: "Level Three",
    size: {
      w: 16,
      h: 16,
    },
    target: {
      row: 8,
      column: 8,
    },
  },
  {
    id: 1,
    name: "Level Four",
    size: {
      w: 32,
      h: 32,
    },
    target: {
      row: 16,
      column: 16,
    },
  },
  {
    id: 1,
    name: "Level Five",
    size: {
      w: 64,
      h: 64,
    },
    target: {
      row: 32,
      column: 32,
    },
  },
];
