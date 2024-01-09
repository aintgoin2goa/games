import * as Phaser from "phaser";
import { Game } from "./game";
import {
  BLOCK_SIZE,
  COLUMNS,
  GUTTER,
  HEIGHT,
  HOLE_SPACING,
  PIECE_RADIUS,
  ROWS,
  WIDTH,
  boardColor,
} from "./constants";
import { Audio } from "./audio";

export class Scene extends Phaser.Scene {
  constructor() {
    super("demo");
  }

  preload() {
    this.load.image("board-hole", "assets/board-hole.png");
    this.load.image("human-yellow", "assets/human-icon-yellow.png");
    this.load.image("robot-yellow", "assets/robot-icon-yellow.png");
    this.load.image("human-red", "assets/human-icon-red.png");
    Audio.preload(this);
  }

  create() {
    this.scale.displaySize.setAspectRatio(WIDTH / HEIGHT);
    this.scale.refresh();
    const blockSize = BLOCK_SIZE;
    const gutters = GUTTER;
    for (let i = 0; i < COLUMNS.length; i++) {
      for (let j = 0; j < ROWS.length; j++) {
        let x = blockSize * i + gutters;
        let y = blockSize * j;
        this.add.image(x, y, "board-hole").setDisplayOrigin(0, 0);
      }
    }

    const game = new Game(this);
    game.start();
  }
}
