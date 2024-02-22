import { Physics } from "phaser";
import { Rat } from "./rat";
import { Directions } from "./types";
import { Cat } from "./cat";
import { Target } from "./target";

export const randomArrayElement = <T>(arr: T[]): T =>
  arr[randomArrayIndex(arr)];

export const randomArrayIndex = (arr: unknown[]): number =>
  Math.floor(Math.random() * arr.length);

export const clone = (obj) => {
  if (structuredClone) {
    return structuredClone(obj);
  }

  return JSON.parse(JSON.stringify(obj));
};

export const turn90DegreesLeft = (dir: Directions): Directions => {
  switch (dir) {
    case "left":
      return "down";
    case "down":
      return "right";
    case "right":
      return "up";
    case "up":
      return "left";
  }
};

export const turn90DegreesRight = (dir: Directions): Directions => {
  switch (dir) {
    case "left":
      return "up";
    case "down":
      return "left";
    case "right":
      return "down";
    case "up":
      return "right";
  }
};

export const turn180Degrees = (dir: Directions): Directions => {
  switch (dir) {
    case "left":
      return "right";
    case "down":
      return "up";
    case "right":
      return "left";
    case "up":
      return "down";
  }
};

export const isSprite = (obj: unknown): obj is Physics.Arcade.Sprite => {
  return typeof obj === "object" && "name" in obj;
};

export const isRat = (obj: unknown): obj is Rat => {
  return isSprite(obj) && obj.name === "rat";
};
export const isCat = (obj: unknown): obj is Cat =>
  isSprite(obj) && obj.name === "cat";

export const isTarget = (obj: unknown): obj is Target =>
  isSprite(obj) && obj.name === "target";

export const singleUseFunction = (
  func: (...args: any[]) => void,
  context: any
) => {
  let called = false;
  return function (...args: any[]) {
    if (called) return;
    func(...args);
    called = true;
  }.bind(context);
};
