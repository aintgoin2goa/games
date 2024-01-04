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
    this.cells = cells ?? new Map();
    for (const col of COLUMNS) {
      for (const row of ROWS) {
        this.cells.set(columnRow2Coord(col, row), null);
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
    return COLUMNS.map((col) => {
      const row = this.getNextAvailableRowForColumn(col);
      return columnRow2Coord(col, row);
    });
  }

  clear() {
    for (const key of this.cells.keys()) {
      this.cells.set(key, null);
    }
  }
}
