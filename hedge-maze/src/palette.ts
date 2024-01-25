export enum PALETTE {
  DARK_GREEN = "#3E4325",
  MID_GREEN = "#827D43",
  LIGHT_GREEN = "#809C62",
  BEIGE = "#C4B7A6",
  BROWN = "#695743",
}

export enum COLOR_USE_CASES {
  HEDGE,
  FLOOR,
  CHARACTER,
  TITLE,
  TITLE_OUTLINE,
  TARGET,
  PATH,
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
  [COLOR_USE_CASES.TITLE, new Color(PALETTE.LIGHT_GREEN)],
  [COLOR_USE_CASES.TITLE_OUTLINE, new Color(PALETTE.DARK_GREEN)],
  [COLOR_USE_CASES.TARGET, new Color(PALETTE.LIGHT_GREEN)],
  [COLOR_USE_CASES.PATH, new Color(PALETTE.BROWN)],
]);

export const colorFor = (useCase: COLOR_USE_CASES): Color => {
  if (!Colors.has(useCase)) {
    throw new Error("Use case not found");
  }

  return Colors.get(useCase)!;
};
