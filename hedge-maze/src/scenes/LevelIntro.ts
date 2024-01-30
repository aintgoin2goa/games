import Phaser from "phaser";
import { HEIGHT, Levels, WIDTH } from "../lib/constants";
import { FONTS } from "../lib/typography";
import { COLOR_USE_CASES, colorFor } from "../lib/palette";
import * as state from "../state";

export default class LevelIntroScene extends Phaser.Scene {
  constructor() {
    super("level");
  }

  preload() {
    this.load.image("title", "img/maze.png");
  }

  create() {
    const level = Levels[state.get("level")];
    this.add.image(WIDTH / 2, HEIGHT / 2, "title");
    this.add.text(50, 20, level.name, {
      fontFamily: FONTS.Underline,
      fontSize: 80,
      color: colorFor(COLOR_USE_CASES.TITLE).toString(),
      strokeThickness: 1,
      align: "centre",
    });
    this.add
      .text(WIDTH / 2, HEIGHT - 100, " PLAY ", {
        fontFamily: FONTS.Underline,
        fontSize: 48,
        color: colorFor(COLOR_USE_CASES.BUTTON_TEXT).toString(),
        backgroundColor: colorFor(COLOR_USE_CASES.BUTTON_BG).toString(),
      })
      .setPadding({ x: 24, y: 16 })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("maze");
      });
  }
}
