import { Physics, Scene } from "phaser";

const TEXTURE = "target";
const FILE = "img/cheese.png";
const FRAME_WIDTH = 54;
const FRAME_HEIGHT = 40;

export class Target extends Physics.Arcade.Sprite {
  scene: Scene;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE, 0);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.getBody().onOverlap = true;
  }

  static load(scene: Scene) {
    scene.load.spritesheet(TEXTURE, FILE, {
      frameWidth: FRAME_WIDTH,
      frameHeight: FRAME_HEIGHT,
    });
  }

  getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }

  reached() {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      ease: "sine.out",
      duration: 500,
    });
  }
}
