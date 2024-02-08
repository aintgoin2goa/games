import { Scene } from "phaser";
import { COLOR_USE_CASES, colorFor } from "./palette";

async function loadFont(name: string, extension: string) {
  const url = `fonts/${name}.${extension}`;
  const newFont = new FontFace(name, `url(${url})`);
  const loaded = await newFont.load();
  document.fonts.add(loaded);
}

export enum FONTS {
  HachicroUndertaleBattle = "HachicroUndertaleBattleFontRegular-PKzBg",
  Underline = "underline",
}

export const loadFonts = async () => {
  // await loadFont(FONTS.HachicroUndertaleBattle, "otf");
  await loadFont(FONTS.Underline, "ttf");
};

export const FontSize: Record<string, number> = {
  title: 128,
  button: 36,
};

export const button = (
  scene: Scene,
  { x, y, text }: { x: number; y: number; text: string }
) => {
  return scene.add
    .text(x, y, ` ${text} `, {
      fontFamily: FONTS.Underline,
      fontSize: "48px",
      color: colorFor(COLOR_USE_CASES.BUTTON_TEXT).toString(),
      backgroundColor: colorFor(COLOR_USE_CASES.BUTTON_BG).toString(),
    })
    .setPadding({ x: 24, y: 16 })
    .setOrigin(0.5)
    .setInteractive();
};
