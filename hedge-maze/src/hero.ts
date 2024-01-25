import { Physics, Scene, Types } from "phaser";

const TEXTURE = "hero";
const FILE = "sprites/astronaut.png";
const FRAME_SIZE = 320;
const SPRITE_SIZE = {
  x: 220,
  y: 270,
};
const SPEED = 300;

export class Hero extends Physics.Arcade.Sprite {
  scene: Scene;
  keys: Types.Input.Keyboard.CursorKeys;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE, 0);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.getBody().setCollideWorldBounds(true);
    this.getBody().setSize(SPRITE_SIZE.x, SPRITE_SIZE.y);
    this.setupKeys();
  }

  setupKeys() {
    this.keys = this.scene.input.keyboard!.createCursorKeys()!;
  }

  static load(scene: Scene) {
    scene.load.spritesheet(TEXTURE, FILE, {
      frameWidth: FRAME_SIZE,
      frameHeight: FRAME_SIZE,
    });
  }

  updateRotation() {
    this.rotation = this.getBody().angle;
  }

  update() {
    this.getBody().setVelocity(0);

    if (this.keys.up.isDown) {
      this.getBody().velocity.y = -SPEED;
      this.updateRotation();
    }
    if (this.keys.down.isDown) {
      this.getBody().velocity.y = SPEED;
      this.updateRotation();
    }
    if (this.keys.right.isDown) {
      this.getBody().velocity.x = SPEED;
      this.updateRotation();
    }
    if (this.keys.left.isDown) {
      this.getBody().velocity.x = -SPEED;
      this.updateRotation();
    }
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
