export enum PALETTE {
  DARK_GREEN = "#3E4325",
  MID_GREEN = "#827D43",
  LIGHT_GREEN = "#809C62",
  BEIGE = "#F7E5C2",
  BROWN = "#3C1F1B",
}

export enum COLOR_USE_CASES {
  HEDGE,
  FLOOR,
  CHARACTER,
  TITLE,
  TITLE_OUTLINE,
  TARGET,
  PATH,
  BUTTON_BG,
  BUTTON_TEXT,
}

export class Color {
  private hexValue: string;

  constructor(hexValue: string) {
    this.hexValue = hexValue;
  }

  toString(): string {
    return this.hexValue;
  }

  toNumber(): number {
    return parseInt(this.hexValue.substring(1), 16);
  }
}

const Colors = new Map<COLOR_USE_CASES, Color>([
  [COLOR_USE_CASES.HEDGE, new Color(PALETTE.MID_GREEN)],
  [COLOR_USE_CASES.FLOOR, new Color(PALETTE.BEIGE)],
  [COLOR_USE_CASES.CHARACTER, new Color(PALETTE.BROWN)],
  [COLOR_USE_CASES.TITLE, new Color(PALETTE.BROWN)],
  [COLOR_USE_CASES.TARGET, new Color(PALETTE.LIGHT_GREEN)],
  [COLOR_USE_CASES.PATH, new Color(PALETTE.BROWN)],
  [COLOR_USE_CASES.BUTTON_BG, new Color(PALETTE.BROWN)],
  [COLOR_USE_CASES.BUTTON_TEXT, new Color(PALETTE.BEIGE)],
]);

export const colorFor = (useCase: COLOR_USE_CASES): Color => {
  if (!Colors.has(useCase)) {
    throw new Error("Use case not found");
  }

  return Colors.get(useCase)!;
};
