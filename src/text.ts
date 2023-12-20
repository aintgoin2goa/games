import {
  FONTS,
  FONT_SIZES,
  HEIGHT,
  WIDTH,
  pieceColors,
  pieceColorsStr,
} from "./constants";

export class Text {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  title(text: string, color: string) {
    return this.scene.add
      .text(WIDTH / 2, HEIGHT / 4, text, {
        fontSize: FONT_SIZES.Title,
        fontFamily: FONTS.AvantGardeGothic,
        color,
      })
      .setOrigin(0.5)
      .setStroke("#000000", 5)
      .setShadow(4, 4, "#000000", 8, true, true);
  }

  button({
    x,
    y,
    text,
    color,
    backgroundColor,
  }: {
    x: number;
    y: number;
    text: string;
    color: string;
    backgroundColor: string;
  }) {
    return this.scene.add
      .text(x, y, text, {
        fontFamily: FONTS.AvantGardeGothic,
        backgroundColor,
        color,
      })
      .setPadding({ x: 24, y: 16 })
      .setOrigin(0.5)
      .setInteractive();
  }

  label({
    x,
    y,
    text,
    color,
  }: {
    x: number;
    y: number;
    text: string;
    color: string;
  }) {
    return this.scene.add
      .text(x, y, text, {
        fontFamily: FONTS.AvantGardeGothic,
        color,
        fontSize: 18,
      })
      .setOrigin(0, 0);
  }
}
