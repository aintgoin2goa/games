export const randomArrayElement = <T>(arr: T[]): T =>
  arr[randomArrayIndex(arr)];

export const randomArrayIndex = (arr: unknown[]): number =>
  Math.floor(Math.random() * arr.length);
