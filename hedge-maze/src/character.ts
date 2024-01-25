import { Scene } from "phaser";
import { Maze } from "./maze";
import { COLOR_USE_CASES, colorFor } from "./palette";
import { TILE_SIZE } from "./constants";

export class Character {
  private scene: Scene;
  private maze: Maze;

  constructor(scene: Scene, maze: Maze) {
    this.scene = scene;
    this.maze = maze;
  }

  draw() {
    const { x, xEnd, y, yEnd } = this.maze.getStartCoords();
    const xPos = x + (xEnd - x) / 2;
    const yPos = y + (yEnd - y) / 2;
    const color = colorFor(COLOR_USE_CASES.CHARACTER);
    this.scene.add.circle(xPos, yPos, TILE_SIZE / 4, color.toNumber());
  }
}
