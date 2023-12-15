import { pieceColors } from "./constants";
import { Column, Row, Piece, Coord } from "./types";
import { columnRow2Coord, getCoords } from "./utils";

const pieces: Map<Coord, Phaser.GameObjects.Graphics> = new Map();

export const piecePlacer =
  (scene: Phaser.Scene) =>
  (piece: Piece, col: Column, row: Row): Promise<void> => {
    const [x, y] = getCoords(col, row);
    const img = scene.add
      .graphics()
      .fillStyle(pieceColors[piece])
      .fillCircle(x, -100, 41)
      .setDepth(-1);

    pieces.set(columnRow2Coord(col, row), img);
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

export const clearBoard = () => {
  for (const img of pieces.values()) {
    img.destroy();
  }

  pieces.clear();
};

export const flash = (scene: Phaser.Scene, coords: Coord[]) => {
  const imgs = coords.map((c) => pieces.get(c));
  console.log("flash", coords, imgs);

  imgs.forEach((img, index) => {
    scene.tweens.add({
      targets: img,
      yoyo: true,
      delay: 25 * index,
      alpha: 0.5,
      repeat: 100,
      duration: 100,
    });
  });
};
