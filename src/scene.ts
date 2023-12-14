import * as Phaser from "phaser";
import * as GameMap from "./map";
import { getColumnFromCoord, invertPiece } from "./utils";
import { piecePlacer } from "./board";
import { Piece } from "./types";
import { WINNER } from "./search";

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
      const column = getColumnFromCoord(pointer.x);
      const row = GameMap.getNextAvailableRowForColumn(column);
      if (!row) {
        console.log("No row found");
        return;
      }
      placePiece(piece, column, row).then(() => {
        GameMap.update(column, row, piece);
        const winnerSearch = GameMap.search(WINNER, piece);
        console.log({ winnerSearch });
        if (winnerSearch.found) {
          alert(`${piece} wins!`);
          location.reload();
        } else {
          piece = invertPiece(piece);
          ready = true;
        }
      });
    });
  }
}
