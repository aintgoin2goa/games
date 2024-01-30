import { Physics, Scene } from "phaser";
import { Maze } from "./maze";

const TEXTURE = "cat";
const FILE = "sprites/cat.png";
const FRAME_SIZE = 545;

const SPRITE_SIZE = {
  x: 480,
  y: 270,
};
// const WALKING_SPEED = 400;
// const RUNNING_SPEED = 400;

// enum Animations {
//   IDLE = "idle",
// }

export class Cat extends Physics.Arcade.Sprite {
  constructor(scene: Scene, maze: Maze) {
    const tile = maze.getRandomTile();
    const coords = maze.getTileCoords(tile.column, tile.row);
    super(scene, coords.x.mid, coords.y.mid, TEXTURE, 0);
    this.setScale(0.75);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setSize(SPRITE_SIZE.x, SPRITE_SIZE.y);
    // this.setupAnimations();
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }

  static load(scene: Scene) {
    scene.load.spritesheet(TEXTURE, FILE, {
      frameWidth: FRAME_SIZE,
      frameHeight: FRAME_SIZE,
    });
  }
}
