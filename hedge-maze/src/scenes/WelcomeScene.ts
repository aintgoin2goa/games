import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../lib/constants";
import { FONTS } from "../lib/typography";
import { COLOR_USE_CASES, colorFor } from "../lib/palette";

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("welcome");
  }

  preload() {
    this.load.image("title", "img/maze.png");
  }

  create() {
    this.add.image(WIDTH / 2, HEIGHT / 2, "title");
    this.add.text(50, 20, "RAT MAZE", {
      fontFamily: FONTS.Underline,
      fontSize: 128,
      color: colorFor(COLOR_USE_CASES.TITLE).toString(),
      strokeThickness: 1,
      align: "centre",
    });
    this.add
      .text(WIDTH / 2, HEIGHT - 100, " START ", {
        fontFamily: FONTS.Underline,
        fontSize: "48px",
        color: colorFor(COLOR_USE_CASES.BUTTON_TEXT).toString(),
        backgroundColor: colorFor(COLOR_USE_CASES.BUTTON_BG).toString(),
      })
      .setPadding({ x: 24, y: 16 })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("level");
      });
  }
}
