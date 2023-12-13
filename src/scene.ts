import * as Phaser from "phaser";
import { getColumnFromCoord, getCoords, piecePlacer } from "./board";

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
    // this.add.shader("RGB Shift Field", 0, 0, 800, 600).setOrigin(0);
    // this.add.shader("Plasma", 0, 0, 800, 172).setOrigin(0);
    const board = this.add.image(0, 0, "board").setOrigin(0, 0);
    const placePiece = piecePlacer(this);
    this.input.on("pointerdown", (pointer) => {
      const column = getColumnFromCoord(pointer.x);
      placePiece("red", column, "6");
    });
  }
}
