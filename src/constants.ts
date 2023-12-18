import type { Column, Coord, Piece, Row } from "./types";

export const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const ROWS = ["1", "2", "3", "4", "5", "6"] as const;

export const COLUMN_MAP: Coord[][] = [
  ["A1", "A2", "A3", "A4", "A5", "A6"],
  ["B1", "B2", "B3", "B4", "B5", "B6"],
  ["C1", "C2", "C3", "C4", "C5", "C6"],
  ["D1", "D2", "D3", "D4", "D5", "D6"],
  ["E1", "E2", "E3", "E4", "E5", "E6"],
  ["F1", "F2", "F3", "F4", "F5", "F6"],
  ["G1", "G2", "G3", "G4", "G5", "G6"],
  ["H1", "H2", "H3", "H4", "H5", "H6"],
];

export const ROW_MAP: Coord[][] = [
  ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"],
  ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"],
  ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3"],
  ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4"],
  ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5"],
  ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6"],
];

export const DIAG_UP_MAP: Coord[][] = [
  ["A4", "B3", "C2", "D1"],
  ["A5", "B3", "C3", "D2", "E1"],
  ["A6", "B5", "C4", "D3", "E2", "F1"],
  ["B4", "C3", "D2", "E1"],
  ["B5", "C4", "D3", "E2", "F1"],
  ["B6", "C5", "D4", "E3", "F2", "G1"],
  ["C4", "D3", "E2", "F1"],
  ["C5", "D4", "E3", "F2", "G1"],
  ["C6", "D5", "E4", "F3", "G2", "H1"],
  ["D4", "E3", "F2", "G1"],
  ["D5", "E4", "F3", "G2", "H1"],
  ["D6", "E5", "F4", "G3", "H2"],
  ["E4", "F3", "G2", "H1"],
  ["E5", "F4", "G3", "H2"],
  ["E6", "F5", "G4", "H3"],
];

export const DIAG_DOWN_MAP: Coord[][] = [
  ["A3", "B4", "C5", "D6"],
  ["A2", "B3", "C4", "D5", "E6"],
  ["A1", "B2", "C3", "D4", "E5", "F6"],
  ["B3", "C4", "D5", "E6"],
  ["B2", "C3", "D4", "E5", "F6"],
  ["B1", "C2", "D3", "E4", "F5", "G6"],
  ["C3", "D4", "E5", "F6"],
  ["C2", "D3", "E4", "F5", "G6"],
  ["C1", "D2", "E3", "F4", "G5", "H6"],
  ["D3", "E4", "F5", "G6"],
  ["D2", "E3", "F4", "G5", "H6"],
  ["D1", "E2", "F3", "G4", "H5"],
  ["E3", "F4", "G5", "H6"],
  ["E2", "F3", "G4", "H5"],
  ["E1", "F2", "G3", "H4"],
];

export const ColumnCoords = new Map<Column, number>([
  ["A", 110],
  ["B", 210],
  ["C", 310],
  ["D", 410],
  ["E", 509],
  ["F", 610],
  ["G", 709],
  ["H", 808],
]);

export const RowCoords = new Map<Row, number>([
  ["1", 10],
  ["2", 111],
  ["3", 208],
  ["4", 309],
  ["5", 413],
  ["6", 509],
]);

export enum COLORS {
  black = "#000000",
  white = "#ffffff",
  red = "#d21f32",
  yellow = "#ffd52f",
}

export const pieceColors: Record<Piece, number> = {
  red: 0xd21f32,
  yellow: 0xffd52f,
};

export const pieceColorsStr: Record<Piece, string> = {
  red: COLORS.red,
  yellow: COLORS.yellow,
};

export const pieceTextColor: Record<Piece, string> = {
  red: "#ffffff",
  yellow: "#000000",
};

export const WIDTH = 1000;
export const HEIGHT = 600;

export enum FONTS {
  AvantGardeGothic = "AvantGardeGothic",
}

export enum FONT_SIZES {
  Title = 120,
}
