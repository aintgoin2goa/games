import { ColumnCoords, RowCoords } from "./constants";
import { Column, Row, Piece } from "./types";
import { getCoords } from "./utils";

export const piecePlacer =
  (scene: Phaser.Scene) =>
  (piece: Piece, col: Column, row: Row): Promise<void> => {
    const [x, y] = getCoords(col, row);
    const img = scene.add.image(x, -100, piece).setOrigin(0).setDepth(-1);
    return new Promise<void>((resolve) => {
      scene.tweens.add({
        targets: img,
        y,
        duration: 500,
        delay: 0,
        ease: "Bounce.Out",
        onComplete: () => setTimeout(resolve, 100),
      });
    });
  };
