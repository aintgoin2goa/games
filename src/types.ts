export const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const ROWS = ["1", "2", "3", "4", "5", "6"] as const;

export type Column = (typeof COLUMNS)[number];
export type Row = (typeof ROWS)[number];
export type Piece = "red" | "yellow";
