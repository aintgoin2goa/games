import { SearchFunction } from "./types";

export const WINNER: SearchFunction = {
  name: "WINNER",
  getPattern: (piece) => [piece, piece, piece, piece],
  suggestMove: () => null,
};

export const NEXT_MOVE_WIN_XXX0: SearchFunction = {
  name: "NEXT_MOVE_WIN__XXX0",
  getPattern: (piece) => [piece, piece, piece, null],
  suggestMove: (pattern) => pattern[3],
};

export const NEXT_MOVE_WIN_0XXX: SearchFunction = {
  name: "NEXT_MOVE_WIN_0XXX",
  getPattern: (piece) => [null, piece, piece, piece],
  suggestMove: (pattern) => pattern[0],
};

export const NEXT_MOVE_WIN_X0XX: SearchFunction = {
  name: "NEXT_MOVE_WIN_X0XX",
  getPattern: (piece) => [piece, null, piece, piece],
  suggestMove: (pattern) => pattern[1],
};

export const NEXT_MOVE_WIN_XX0X: SearchFunction = {
  name: "NEXT_MOVE_WIN_XX0X",
  getPattern: (piece) => [piece, piece, null, piece],
  suggestMove: (pattern) => pattern[2],
};

export const MOVE_XX00: SearchFunction = {
  name: "MOVE_XX00",
  getPattern: (piece) => [piece, piece, null, null],
  suggestMove: (pattern) => pattern[2],
};

export const MOVE_00XX: SearchFunction = {
  name: "MOVE_00XX",
  getPattern: (piece) => [null, null, piece, piece],
  suggestMove: (pattern) => pattern[1],
};

export const SNEAKY_XX00: SearchFunction = {
  name: "SNEAKY_XX00",
  getPattern: (piece) => [piece, piece, null, null],
  suggestMove: (pattern) => pattern[3],
};

export const SNEAKY_00XX: SearchFunction = {
  name: "SNEAKY_00XX",
  getPattern: (piece) => [null, null, piece, piece],
  suggestMove: (pattern) => pattern[0],
};

export const SINGLE_X000: SearchFunction = {
  name: "SINGLE_X000",
  getPattern: (piece) => [piece, null, null, null],
  suggestMove: (pattern) => pattern[1],
};

export const SINGLE_0X00: SearchFunction = {
  name: "SINGLE_0X00",
  getPattern: (piece) => [null, piece, null, null],
  suggestMove: (pattern) => pattern[2],
};

export const SINGLE_00X0: SearchFunction = {
  name: "SINGLE_00X0",
  getPattern: (piece) => [null, null, piece, null],
  suggestMove: (pattern) => pattern[1],
};

export const SINGLE_000X: SearchFunction = {
  name: "SINGLE_000X",
  getPattern: (piece) => [null, null, null, piece],
  suggestMove: (pattern) => pattern[2],
};

const ALLSEARCHES = [
  WINNER,
  NEXT_MOVE_WIN_XXX0,
  NEXT_MOVE_WIN_0XXX,
  NEXT_MOVE_WIN_X0XX,
  NEXT_MOVE_WIN_XX0X,
  MOVE_00XX,
  MOVE_XX00,
  SNEAKY_00XX,
  SNEAKY_XX00,
  SINGLE_000X,
  SINGLE_00X0,
  SINGLE_0X00,
  SINGLE_X000,
];

export const getSearchByName = (name) =>
  ALLSEARCHES.find((s) => s.name === name);
