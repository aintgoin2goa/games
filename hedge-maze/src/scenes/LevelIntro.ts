import Phaser from "phaser";
import { Levels } from "../lib/levels";
import { HEIGHT, WIDTH } from "../lib/constants";
import { FONTS, button } from "../lib/typography";
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
    this.title = props.text ?? Levels[state.get("level")].name;
    this.buttonText = props.buttonText ?? "PLAY";
  }

  create() {
    this.add.image(WIDTH / 2, HEIGHT / 2, "title");
    this.add.text(50, 20, this.title, {
      fontFamily: FONTS.Underline,
      fontSize: 80,
      color: colorFor(COLOR_USE_CASES.TITLE).toString(),
      strokeThickness: 1,
      align: "centre",
    });
    button(this, { x: WIDTH / 2, y: HEIGHT - 100, text: this.buttonText }).on(
      "pointerdown",
      () => {
        this.scene.start("maze");
      }
    );

    const enter = this.input.keyboard?.addKey("ENTER");
    enter!.on("up", () => {
      this.scene.start("maze");
    });
  }
}
