import { Level } from "../types";

export const Levels: Level[] = [
  {
    id: 0,
    name: "Level One",
    size: {
      w: 8,
      h: 8,
    },
    target: {
      row: 2,
      column: 2,
    },
    cats: 1,
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
    cats: 2,
  },
  {
    id: 1,
    name: "Level Four",
    size: {
      w: 16,
      h: 16,
    },
    target: {
      row: 8,
      column: 8,
    },
    cats: 4,
  },
  {
    id: 1,
    name: "Level Five",
    size: {
      w: 32,
      h: 32,
    },
    target: {
      row: 16,
      column: 16,
    },
    cats: 8,
  },
];
