import * as Phaser from "phaser";
import { getColumnFromCoord, getCoords, piecePlacer } from "./board";
import GameBoard from "./game";

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
    const placePiece = piecePlacer(this);
    this.input.on("pointerdown", (pointer) => {
      console.log("pointerfown", pointer);
      const column = getColumnFromCoord(pointer.x);
      const row = GameBoard.col(column).getNextRow();
      if (row === null) {
        return;
      }
      const piece = GameBoard.nextGo();
      console.log({ row, column, piece });
      placePiece(piece, column, row);
      GameBoard.update(column, row, piece);
    });
  }
}
