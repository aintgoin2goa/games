import * as Phaser from "phaser";
import * as GameMap from "./map";
import { getColumnFromCoord, invertPiece } from "./utils";
import { clearBoard, flash, piecePlacer } from "./board";
import { Piece } from "./types";
import { WINNER } from "./search";
import {
  HEIGHT,
  WIDTH,
  pieceColors,
  pieceColorsStr,
  pieceTextColor,
} from "./constants";

export class Scene extends Phaser.Scene {
  constructor() {
    super("demo");
  }

  preload() {
    this.load.image("board", "assets/board.png");
    this.load.image("red", "assets/red.png");
    this.load.image("yellow", "assets/yellow.png");
  }

  create() {
    const board = this.add.image(0, 0, "board").setOrigin(0, 0);
    let piece: Piece = "red";
    let ready = true;
    const placePiece = piecePlacer(this);
    this.input.on("pointerdown", (pointer) => {
      if (!ready) {
        return;
      }
      ready = false;
      const column = getColumnFromCoord(pointer.x);
      const row = GameMap.getNextAvailableRowForColumn(column);
      if (!row) {
        console.log("No row found");
        return;
      }
      placePiece(piece, column, row).then(() => {
        GameMap.update(column, row, piece);
        const winnerSearch = GameMap.search(WINNER, piece);
        if (winnerSearch.found) {
          flash(this, winnerSearch.coords);
          const winText = this.add
            .text(WIDTH / 2, HEIGHT / 4, `${piece} wins!`, {
              color: pieceColorsStr[piece],
              fontFamily: "Arial Black",
              fontSize: 80,
            })
            .setShadow(4, 4, "#000000", 8, true, true)
            .setOrigin(0.5);

          const button = this.add
            .text(WIDTH / 2, HEIGHT / 2, "Play Again", {
              backgroundColor: pieceColorsStr[piece],
              color: pieceTextColor[piece],
            })
            .setPadding({ x: 24, y: 16 })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {
              GameMap.clear();
              clearBoard();
              winText.destroy();
              button.destroy();
            });
        } else {
          piece = invertPiece(piece);
          ready = true;
        }
      });
    });
  }
}
