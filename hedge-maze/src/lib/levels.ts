import { Level } from "../types";

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
    cats: 0,
    mapZoomLevel: 0.6,
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
    cats: 1,
    mapZoomLevel: 0.1,
  },
  {
    id: 2,
    name: "Level Three",
    size: {
      w: 8,
      h: 8,
    },
    target: {
      row: 4,
      column: 4,
    },
    cats: 2,
    mapZoomLevel: 0.1,
  },
  {
    id: 3,
    name: "Level Four",
    size: {
      w: 12,
      h: 12,
    },
    target: {
      row: 6,
      column: 6,
    },
    cats: 4,
    mapZoomLevel: 0.1,
  },
  {
    id: 4,
    name: "Level Five",
    size: {
      w: 16,
      h: 16,
    },
    target: {
      row: 8,
      column: 8,
    },
    cats: 8,
    mapZoomLevel: 0.1,
  },
];
