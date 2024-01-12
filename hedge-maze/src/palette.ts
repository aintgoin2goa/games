export enum PALETTE {
  DARK_GREEN = "#3E4325",
  MID_GREEN = "#827D43",
  LIGHT_GREEN = "#809C62",
  BEIGE = "#C4B7A6",
  BROWN = "##695743",
}

export enum COLOR_USE_CASES {
  HEDGE,
  FLOOR,
  CHARACTER,
  TITLE,
  TITLE_OUTLINE,
}

const Colors = new Map<COLOR_USE_CASES, PALETTE>([
  [COLOR_USE_CASES.HEDGE, PALETTE.MID_GREEN],
  [COLOR_USE_CASES.FLOOR, PALETTE.BEIGE],
  [COLOR_USE_CASES.CHARACTER, PALETTE.BROWN],
  [COLOR_USE_CASES.TITLE, PALETTE.LIGHT_GREEN],
  [COLOR_USE_CASES.TITLE_OUTLINE, PALETTE.DARK_GREEN],
]);

export const colorFor = (useCase: COLOR_USE_CASES): PALETTE => {
  if (!Colors.has(useCase)) {
    throw new Error("Use case not found");
  }

  return Colors.get(useCase)!;
};
