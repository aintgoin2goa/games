import Phaser from "phaser";
import { Levels } from "../lib/levels";
import { HEIGHT, WIDTH } from "../lib/constants";
import { FONTS } from "../lib/typography";
import { COLOR_USE_CASES, colorFor } from "../lib/palette";
import * as state from "../state";

export type LevelIntroProps = {
  text?: string;
  buttonText?: string;
};

export default class LevelIntroScene extends Phaser.Scene {
  title: string;
  buttonText: string;

  constructor() {
    super("level");
  }

  preload() {
    this.load.image("title", "img/maze.png");
  }

  init(props: LevelIntroProps = {}) {
    console.log("LevelIntro", "init", props, this.title);
    this.title = props.text ?? Levels[state.get("level")].name;
    this.buttonText = props.buttonText ?? "PLAY";
  }

  create() {
    console.log("LevelInto", "create", { title: this.title });
    this.add.image(WIDTH / 2, HEIGHT / 2, "title");
    this.add.text(50, 20, this.title, {
      fontFamily: FONTS.Underline,
      fontSize: 80,
      color: colorFor(COLOR_USE_CASES.TITLE).toString(),
      strokeThickness: 1,
      align: "centre",
    });
    this.add
      .text(WIDTH / 2, HEIGHT - 100, ` ${this.buttonText} `, {
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

    const enter = this.input.keyboard?.addKey("ENTER");
    enter!.on("up", () => {
      this.scene.start("maze");
    });
  }
}
