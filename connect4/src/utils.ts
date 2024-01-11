import {
  BLOCK_SIZE,
  COLUMNS,
  ColumnCoords,
  GUTTER,
  HOLE_SPACING,
  PIECE_RADIUS,
  ROWS,
  RowCoords,
} from "./constants";
import { Column, Coord, Row, Piece } from "./types";

export const columnRow2Coord = (col: Column, row: Row): Coord =>
  `${col}${row}` as Coord;

export const tuple2coord = (tuple: [Column, Row]): Coord =>
  columnRow2Coord(tuple[0], tuple[1]);

export const coord2Tuple = (coord: Coord): [Column, Row] => [
  coord[0] as Column,
  coord[1] as Row,
];

export const coordToColumnRow = (
  coord: Coord,
): { column: Column; row: Row } => {
  const tuple = coord2Tuple(coord);
  return { column: tuple[0], row: tuple[1] };
};

export const getCoords = (col: Column, row: Row): [number, number] => {
  const x =
    COLUMNS.indexOf(col) * BLOCK_SIZE + GUTTER + PIECE_RADIUS + HOLE_SPACING;
  const y = (ROWS.indexOf(row) + 1) * BLOCK_SIZE + PIECE_RADIUS + HOLE_SPACING;
  return [x, y];
};

export const getColumnFromCoord = (x: number): Column => {
  let previousCol: Column;
  for (const [col, coord] of ColumnCoords.entries()) {
    if (x < coord) {
      return previousCol;
    }
    previousCol = col;
  }

  return "H";
};

export const invertPiece = (piece: Piece): Piece =>
  piece === "red" ? "yellow" : "red";
