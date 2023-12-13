import { Scene } from "./scene";
import type { Types } from "phaser";
import { Game, AUTO } from "phaser";

const config: Types.Core.GameConfig = {
  title: "Connect4",
  type: AUTO,
  backgroundColor: "#ffffff",
  //   transparent: true,
  width: 800,
  height: 600,
  scene: Scene,
};

const game = new Game(config);
