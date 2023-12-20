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

export class Scene extends Phaser.Scene {
  constructor() {
    super("demo");
  }

  preload() {
    this.load.image("human-yellow", "assets/human-icon-yellow.png");
    this.load.image("robot-yellow", "assets/robot-icon-yellow.png");
    this.load.image("human-red", "assets/human-icon-red.png");
  }

  create() {
    this.scale.displaySize.setAspectRatio(WIDTH / HEIGHT);
    this.scale.refresh();
    const blockSize = BLOCK_SIZE;
    const spacing = HOLE_SPACING;
    const gutters = GUTTER;
    const radius = PIECE_RADIUS;
    for (let i = 0; i < COLUMNS.length; i++) {
      for (let j = 0; j < ROWS.length; j++) {
        let x = blockSize * i + gutters;
        let y = blockSize * j;
        let block = this.add
          .graphics()
          .fillStyle(boardColor, 1)
          .fillRect(x, y, blockSize, blockSize);
        let hole = this.make
          .graphics()
          .fillStyle(0xffffff)
          .fillCircle(x + spacing + radius, y + spacing + radius, radius);
        let mask = new Phaser.Display.Masks.BitmapMask(this, hole);
        mask.invertAlpha = true;
        block.setMask(mask);
      }
    }

    const game = new Game(this);
    game.start();
  }
}
