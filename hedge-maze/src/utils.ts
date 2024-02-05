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

export const isRat = (obj: Physics.Arcade.Sprite): obj is Rat =>
  obj.name === "rat";
export const isCat = (obj: Physics.Arcade.Sprite): obj is Cat =>
  obj.name === "cat";
export const isTarget = (obj: Physics.Arcade.Sprite): obj is Target =>
  obj.name === "target";

//   export const animation = (obj: Physics.Arcade.Sprite, {name: string, textureprefix) => {
//   if(obj.scene.anims.exists(name)){
//     return;
//   }

//   const frames = obj.anims.generateFrameNames({})
// }
