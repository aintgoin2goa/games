import * as Phaser from "phaser";
import { Piece } from "./types";
import {
  FONTS,
  HEIGHT,
  WIDTH,
  pieceColors,
  pieceColorsStr,
  pieceTextColor,
} from "./constants";
import { Text } from "./text";
import { Game } from "./game";

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
    const board = this.add.image(100, 0, "board").setOrigin(0, 0);
    const game = new Game(this);
    game.start();
  }
}
