import {
  COLUMN_MAP,
  DIAG_DOWN_MAP,
  DIAG_UP_MAP,
  ROW_MAP,
  COLUMNS,
  ROWS,
} from "./constants";
import { Column, Coord, MaybePiece, Piece, Row, SearchFunction } from "./types";
import { columnRow2Coord } from "./utils";

const cells = new Map<Coord, MaybePiece>();
for (const col of COLUMNS) {
  for (const row of ROWS) {
    cells.set(columnRow2Coord(col, row), null);
  }
}

const getCellCollection = (coords: Coord[]): MaybePiece[] =>
  coords.map((coord) => cells.get(coord));

const searchLine = (line: Coord[], pattern: MaybePiece[]): Coord[] => {
  const search = JSON.stringify(pattern);

  let index = 0;
  let endIndex = 4;
  while (endIndex <= line.length) {
    const coords = line.slice(index, endIndex);
    const pieces = getCellCollection(coords);
    const searchPieces = JSON.stringify(pieces);
    if (searchPieces === search) {
      return coords;
    }
    index++;
    endIndex++;
  }

  return [];
};

const searchCollection = (
  collection: Coord[][],
  pattern: MaybePiece[],
): Coord[] => {
  if (pattern.length !== 4) {
    throw new Error("Pattern must have 4 entries");
  }

  let found: Coord[] = [];
  for (const line of collection) {
    const lineResult = searchLine(line, pattern);
    found = found.concat(lineResult);
  }
  return found;
};

const doSearch = (pattern: MaybePiece[]): Coord[] => {
  let found = [];
  found = found.concat(searchCollection(COLUMN_MAP, pattern));
  found = found.concat(searchCollection(ROW_MAP, pattern));
  found = found.concat(searchCollection(DIAG_DOWN_MAP, pattern));
  found = found.concat(searchCollection(DIAG_UP_MAP, pattern));

  return found;
};

interface SearchResult {
  found: boolean;
  coords: Coord[];
  name: string;
}

export const search = (func: SearchFunction, piece: Piece): SearchResult => {
  const { name } = func;
  const pattern = func.getPattern(piece);
  const coords = doSearch(pattern);
  return {
    name,
    coords,
    found: coords.length > 0,
  };
};

export const update = (col: Column, row: Row, piece: Piece) => {
  const coord: Coord = `${col}${row}`;
  cells.set(coord, piece);
};

export const getNextAvailableRowForColumn = (col: Column): Row => {
  for (let i = ROWS.length - 1; i > -1; i--) {
    const coord = columnRow2Coord(col, ROWS[i]);
    const result = cells.get(coord);
    if (result === null) {
      return ROWS[i];
    }
  }

  return null;
};

export const clear = () => {
  for (const key of cells.keys()) {
    cells.set(key, null);
  }
};
