import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../lib/constants";
import { FONTS, button } from "../lib/typography";
import { COLOR_USE_CASES, colorFor } from "../lib/palette";
import * as state from "../state";

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("welcome");
  }

  preload() {
    this.load.image("title", "img/maze.png");
  }

  create() {
    const currentLevel = state.get("level");
    this.add.image(WIDTH / 2, HEIGHT / 2, "title");
    this.add.text(50, 20, "RAT MAZE", {
      fontFamily: FONTS.Underline,
      fontSize: 128,
      color: colorFor(COLOR_USE_CASES.TITLE).toString(),
      strokeThickness: 1,
      align: "centre",
    });
    if (currentLevel > 0) {
      button(this, { x: 180, y: HEIGHT - 100, text: "CONTINUE" }).on(
        "pointerdown",
        () => {
          this.scene.start("level");
        }
      );
      button(this, { x: WIDTH - 170, y: HEIGHT - 100, text: "RESTART" }).on(
        "pointerdown",
        () => {
          state.resetLevel();
          this.scene.start("level");
        }
      );
    } else {
      button(this, { x: WIDTH / 2, y: HEIGHT - 100, text: "START" }).on(
        "pointerdown",
        () => {
          this.scene.start("level");
        }
      );
    }
  }
}
