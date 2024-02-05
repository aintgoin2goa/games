import { Physics, Scene, Types } from "phaser";
import { Target } from "./target";
import { MazeTile } from "./types";
import { Maze } from "./maze";
import debug from "debug";

const TEXTURE = "hero";
const FILE = "sprites/rat.png";
const FRAME_SIZE = 100;
const SPRITE_SIZE = {
  x: 100,
  y: 60,
};
const SPEED = 600;

enum Animations {
  WALK = "hero_walk",
  JUMP = "hero_jump",
}

export class Rat extends Physics.Arcade.Sprite {
  scene: Scene;
  keys: Types.Input.Keyboard.CursorKeys;
  target: Target;
  hasTarget: boolean;
  currentTile: MazeTile;
  maze: Maze;
  debug: ReturnType<typeof debug>;

  constructor(scene: Scene, x: number, y: number, target: Target, maze: Maze) {
    super(scene, x, y, TEXTURE, 0);
    this.debug = debug("rat");
    this.target = target;
    this.scene = scene;
    this.maze = maze;
    this.name = "rat";
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setSize(SPRITE_SIZE.x, SPRITE_SIZE.y);
    this.setupKeys();
    this.setupAnimations();
  }

  static load(scene: Scene) {
    scene.load.spritesheet(TEXTURE, FILE, {
      frameWidth: FRAME_SIZE,
      frameHeight: FRAME_SIZE,
    });
  }

  setupKeys() {
    this.keys = this.scene.input.keyboard!.createCursorKeys()!;
  }

  setupAnimations() {
    if (!this.scene.anims.exists(Animations.WALK)) {
      this.scene.anims.create({
        key: Animations.WALK,
        frameRate: 8,
        frames: this.scene.anims.generateFrameNumbers(TEXTURE, {
          start: 0,
          end: 3,
        }),
        repeat: -1,
      });
    }
  }

  updateRotation() {
    this.rotation = this.getBody().angle;
  }

  update() {
    const currentTile = this.maze.getTileForCoords(this.x, this.y);
    if (currentTile.id !== this.currentTile?.id) {
      this.currentTile = currentTile;
      this.debug("current tile", this.currentTile.id);
    }
    let isWalking = false;
    this.getBody().setVelocity(0);

    if (this.keys.up.isDown) {
      this.getBody().velocity.y = -SPEED;
      this.updateRotation();
      isWalking = true;
    }
    if (this.keys.down.isDown) {
      this.getBody().velocity.y = SPEED;
      this.updateRotation();
      isWalking = true;
    }
    if (this.keys.right.isDown) {
      this.getBody().velocity.x = SPEED;
      this.updateRotation();
      isWalking = true;
    }
    if (this.keys.left.isDown) {
      this.getBody().velocity.x = -SPEED;
      this.updateRotation();
      isWalking = true;
    }

    if (isWalking) {
      this.play(Animations.WALK, true);
    } else {
      this.stop();
    }
  }

  hasReachedTarget() {
    this.hasTarget = true;
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
