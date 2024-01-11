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

export class GameMap {
  private cells: Map<Coord, MaybePiece>;

  constructor(cells?: Map<Coord, MaybePiece>) {
    if (cells) {
      this.cells = cells;
    } else {
      this.cells = new Map();
      for (const col of COLUMNS) {
        for (const row of ROWS) {
          this.cells.set(columnRow2Coord(col, row), null);
        }
      }
    }
  }

  clone() {
    const cells = Array.from(this.cells.entries());
    const cellMap = new Map(cells);
    return new GameMap(cellMap);
  }

  getCellCollection(coords: Coord[]) {
    return coords.map((coord) => this.cells.get(coord));
  }

  rawData() {
    return Array.from(this.cells.entries()).reduce((data, entry) => {
      data[entry[0]] = entry[1];
      return data;
    }, {});
  }

  update(col: Column, row: Row, piece: Piece) {
    const coord: Coord = columnRow2Coord(col, row);
    this.cells.set(coord, piece);
  }

  getNextAvailableRowForColumn(col: Column): Row {
    for (let i = ROWS.length - 1; i > -1; i--) {
      const coord = columnRow2Coord(col, ROWS[i]);
      const result = this.cells.get(coord);
      if (result === null) {
        return ROWS[i];
      }
    }

    return null;
  }

  getAllPossibleMoves(): Coord[] {
    const moves = [];
    for (const col of COLUMNS) {
      const row = this.getNextAvailableRowForColumn(col);
      if (row) {
        moves.push(columnRow2Coord(col, row));
      }
    }

    return moves;
  }

  clear() {
    for (const key of this.cells.keys()) {
      this.cells.set(key, null);
    }
  }
}
