import * as Phaser from "phaser";
import { getCoords, piecePlacer } from "./board";

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
    placePiece("red", "A", "6");
    placePiece("yellow", "B", "6");
    placePiece("red", "C", "6");
    placePiece("yellow", "D", "6");
    placePiece("red", "E", "6");
    placePiece("yellow", "F", "6");
    placePiece("red", "G", "6");
    placePiece("yellow", "H", "6");
    placePiece("yellow", "A", "5");
    placePiece("red", "A", "4");
    placePiece("yellow", "A", "3");
    placePiece("red", "A", "2");
    placePiece("yellow", "A", "1");

    // const logo = this.add.image(400, 70, "logo");
    // this.tweens.add({
    //   targets: logo,
    //   y: 350,
    //   duration: 1500,
    //   ease: "Sine.inOut",
    //   yoyo: false,
    //   repeat: -1,
    // });
  }
}
