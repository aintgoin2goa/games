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
