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

type Pattern = [MaybePiece, MaybePiece, MaybePiece, MaybePiece];
type Patterns = Map<string, Pattern>;
type CoordList = [Coord, Coord, Coord, Coord];
type SearchLineResult = Map<string, CoordList>;
type SearchCollectionResult = Map<string, CoordList[]>;

const cells = new Map<Coord, MaybePiece>();
for (const col of COLUMNS) {
  for (const row of ROWS) {
    cells.set(columnRow2Coord(col, row), null);
  }
}

const getCellCollection = (coords: Coord[]): MaybePiece[] =>
  coords.map((coord) => cells.get(coord));

const searchLine = (line: Coord[], patterns: Patterns): SearchLineResult => {
  let searches: Map<string, string> = new Map();
  for (const [name, pattern] of patterns.entries()) {
    searches.set(name, JSON.stringify(pattern));
  }

  let index = 0;
  let endIndex = 4;
  const result = new Map();
  while (endIndex <= line.length) {
    const coords = line.slice(index, endIndex);
    const pieces = getCellCollection(coords);
    const searchPieces = JSON.stringify(pieces);
    for (const [name, pattern] of searches.entries()) {
      if (pattern === searchPieces) {
        result.set(name, coords);
      }
    }
    index++;
    endIndex++;
  }

  return result;
};

const mergeResults = (
  ...results: SearchCollectionResult[]
): SearchCollectionResult => {
  const merged: SearchCollectionResult = new Map();
  for (const result of results) {
    for (const [name, coords] of result.entries()) {
      if (!merged.has(name)) {
        merged.set(name, coords);
      } else {
        const current = merged.get(name);
        current.concat(coords);
        merged.set(name, current);
      }
    }
  }

  return merged;
};

const searchCollection = (
  collection: Coord[][],
  patterns: Patterns,
): SearchCollectionResult => {
  let found: SearchCollectionResult = new Map();
  for (const line of collection) {
    const lineResult = searchLine(line, patterns);
    for (const [name, coords] of lineResult.entries()) {
      const existing = found.has(name) ? found.get(name) : [];
      existing.push(coords);
      found.set(name, existing);
    }
  }
  return found;
};

const doSearch = (patterns: Patterns): SearchCollectionResult => {
  return mergeResults(
    searchCollection(DIAG_DOWN_MAP, patterns),
    searchCollection(DIAG_UP_MAP, patterns),
    searchCollection(COLUMN_MAP, patterns),
    searchCollection(ROW_MAP, patterns),
  );
};

export interface SearchResult {
  results: SearchCollectionResult;
}

export const search = (funcs: SearchFunction[], piece: Piece): SearchResult => {
  const patterns: Patterns = new Map();
  for (const func of funcs) {
    patterns.set(func.name, func.getPattern(piece));
  }
  const results = doSearch(patterns);
  return {
    results,
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

export const getAllPossibleMoves = (): Coord[] => {
  return COLUMNS.map((col) => {
    const row = getNextAvailableRowForColumn(col);
    return columnRow2Coord(col, row);
  });
};

export const clear = () => {
  for (const key of cells.keys()) {
    cells.set(key, null);
  }
};
