const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
const ROWS = ["1", "2", "3", "4", "5", "6"] as const;
const GRID_SIZE = 100;
const GRID_PADDING = 10;

type Column = (typeof COLUMNS)[number];
type Row = (typeof ROWS)[number];
type Piece = "red" | "yellow";

const ColumnCoords = new Map<Column, number>([
  ["A", 10],
  ["B", 110],
  ["C", 210],
  ["D", 310],
  ["E", 409],
  ["F", 510],
  ["G", 609],
  ["H", 708],
]);

const RowCoords = new Map<Row, number>([
  ["1", 10],
  ["2", 111],
  ["3", 208],
  ["4", 309],
  ["5", 413],
  ["6", 509],
]);

export const getCoords = (col: Column, row: Row): [number, number] => {
  const x = ColumnCoords.get(col);
  const y = RowCoords.get(row);
  return [x, y];
};

export const piecePlacer =
  (scene: Phaser.Scene) => (piece: Piece, col: Column, row: Row) => {
    const [x, y] = getCoords(col, row);
    scene.add.image(x, y, piece).setOrigin(0);
  };
