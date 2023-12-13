import { COLUMNS, Column, Piece, ROWS, Row } from "./types";

class ColumnData {
  private label: Column;

  private slots: Map<Row, Piece | null>;

  constructor(label: Column) {
    this.label = label;
    this.slots = new Map([
      ["1", null],
      ["2", null],
      ["3", null],
      ["4", null],
      ["5", null],
      ["6", null],
    ]);
  }

  addPiece(row: Row, piece: Piece): Row {
    if (row !== this.getNextRow()) {
      throw new Error("BAD ROW");
    }
    this.slots.set(row, piece);
    return row;
  }

  getNextRow(): Row | null {
    for (const row of Array.from(this.slots.keys()).reverse()) {
      if (this.slots.get(row) === null) {
        return row;
      }
    }
    return null;
  }
}
class GameBoard {
  private columns: Map<Column, ColumnData>;
  private currentPiece: Piece;

  constructor() {
    this.columns = new Map(COLUMNS.map((col) => [col, new ColumnData(col)]));
  }

  col(col: Column) {
    return this.columns.get(col);
  }

  update(col: Column, row: Row, piece: Piece) {
    this.col(col).addPiece(row, piece);
  }

  nextGo(): Piece {
    this.currentPiece = this.currentPiece === "red" ? "yellow" : "red";
    return this.currentPiece;
  }
}

export default new GameBoard();
