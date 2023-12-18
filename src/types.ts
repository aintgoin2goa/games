import { COLUMNS, ROWS } from "./constants";

export type Column = (typeof COLUMNS)[number];

export type Row = (typeof ROWS)[number];

export type Piece = "red" | "yellow";

export type MaybePiece = Piece | null;

export type Coord = `${Column}${Row}`;

export type MapEntry = [coord: Coord, piece: MaybePiece];

export type MatchedPattern = [Coord, Coord, Coord, Coord];

export type PlayerTypes = "human" | "computer";

export interface SearchFunction {
  name: string;
  getPattern: (
    piece: Piece,
  ) => [MaybePiece, MaybePiece, MaybePiece, MaybePiece];
  suggestMove: (
    matchedPattern: MatchedPattern,
    possibleMoves?: Coord[],
  ) => Coord | null;
}
