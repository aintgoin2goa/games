import { SearchFunction } from "./types";

export const WINNER: SearchFunction = {
  name: "WINNER",
  getPattern: (piece) => [piece, piece, piece, piece],
};
