import { Scene } from "./scene";
import type { Types } from "phaser";
import { Game, AUTO } from "phaser";
import { HEIGHT, WIDTH } from "./constants";

const config: Types.Core.GameConfig = {
  title: "Connect4",
  type: AUTO,
  backgroundColor: "#ffffff",
  //   transparent: true,
  width: WIDTH,
  height: HEIGHT,
  scene: Scene,
};

const game = new Game(config);
