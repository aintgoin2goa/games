import { Column, Row, Piece } from "./types";

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

export const piecePlacer =
  (scene: Phaser.Scene) => (piece: Piece, col: Column, row: Row) => {
    const [x, y] = getCoords(col, row);
    const img = scene.add.image(x, -100, piece).setOrigin(0).setDepth(-1);
    scene.tweens.add({
      targets: img,
      y,
      duration: 500,
      delay: 0,
      ease: "Bounce.Out",
    });
  };
