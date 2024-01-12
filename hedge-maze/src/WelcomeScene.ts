import Phaser from "phaser";
import { HEIGHT, WIDTH } from "./constants";
import { FONTS } from "./typography";
import { COLORS } from "../../connect4/src/constants";
import { COLOR_USE_CASES, colorFor } from "./palette";

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("welcome");
  }

  preload() {
    this.load.image("hedge", "img/hedge-maze.webp");
  }

  create() {
    this.add.image(WIDTH / 2, HEIGHT / 2, "hedge");
    this.add.text(150, HEIGHT / 4, "HEDGE\n MAZE", {
      fontFamily: FONTS.HachicroUndertaleBattle,
      fontSize: "128px",
      color: colorFor(COLOR_USE_CASES.TITLE),
      stroke: colorFor(COLOR_USE_CASES.TITLE_OUTLINE),
      strokeThickness: 1,
      align: "centre",
    });
    this.add
      .text(WIDTH / 2, HEIGHT - 100, " PLAY ", {
        fontFamily: FONTS.HachicroUndertaleBattle,
        fontSize: "48px",
        color: colorFor(COLOR_USE_CASES.TITLE),
        backgroundColor: colorFor(COLOR_USE_CASES.TITLE_OUTLINE),
      })
      .setPadding({ x: 24, y: 16 })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        alert("START GAME");
      });
  }
}
