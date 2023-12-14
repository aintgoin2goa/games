// import { COLUMNS, Column, Coord, Piece, ROWS, Row } from "./types";

// class ColumnData {
//   private label: Column;

//   private slots: Map<Row, Piece | null>;

//   constructor(label: Column) {
//     this.label = label;
//     this.slots = new Map([
//       ["1", null],
//       ["2", null],
//       ["3", null],
//       ["4", null],
//       ["5", null],
//       ["6", null],
//     ]);
//   }

//   coord(row: Row): Coord {
//     return `${this.label}${row}`;
//   }

//   get data(): [Coord, Piece | null][] {
//     return Array.from(this.slots.entries()).map(([row, piece]) => [
//       `${this.label}${row}`,
//       piece,
//     ]);
//   }

//   addPiece(row: Row, piece: Piece): Row {
//     if (row !== this.getNextRow()) {
//       throw new Error("BAD ROW");
//     }
//     this.slots.set(row, piece);
//     return row;
//   }

//   getNextRow(): Row | null {
//     for (const row of Array.from(this.slots.keys()).reverse()) {
//       if (this.slots.get(row) === null) {
//         return row;
//       }
//     }
//     return null;
//   }
// }

// class RowData {
//   private label: Row;

//   private slots: Map<Column, Piece | null>;

//   constructor(label: Row) {
//     this.label = label;
//     this.slots = new Map<Column, Piece | null>([
//       ["A", null],
//       ["B", null],
//       ["C", null],
//       ["D", null],
//       ["E", null],
//       ["F", null],
//       ["G", null],
//       ["H", null],
//     ]);
//   }

//   get data(): [Coord, Piece | null][] {
//     return Array.from(this.slots.entries()).map(([col, piece]) => [
//       `${col}${this.label}`,
//       piece,
//     ]);
//   }

//   addPiece(column: Column, piece: Piece) {
//     this.slots.set(column, piece);
//   }
// }

// class GameMap {
//   private columns: Map<Column, ColumnData>;
//   private currentPiece: Piece;

//   constructor() {
//     this.columns = new Map(COLUMNS.map((col) => [col, new ColumnData(col)]));
//   }

//   col(col: Column) {
//     return this.columns.get(col);
//   }

//   update(col: Column, row: Row, piece: Piece) {
//     this.col(col).addPiece(row, piece);
//   }

//   nextGo(): Piece {
//     this.currentPiece = this.currentPiece === "red" ? "yellow" : "red";
//     return this.currentPiece;
//   }
// }

// export default new GameMap();
