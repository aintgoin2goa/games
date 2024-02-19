import { Physics, Scene, Types } from "phaser";
import { Target } from "./target";
import { MazeTile } from "./types";
import { Maze } from "./maze";
import debug from "debug";
import { Joystick } from "./joystick";
import { Animation, createAnimations } from "./lib/animations";
import { EventNames, subscribe } from "./lib/events";

const TEXTURE = "hero";
const ATLAS_FILE = "sprites/rat.png";
const ATLAS_JSON = "sprites/rat.json";

const SPEED = 800;

enum Animations {
  IDLE = "rat_idle",
  WALK = "rat_walk",
  DIE = "rat_die",
}

const AnimationDefinitions: Record<Animations, Animation> = {
  [Animations.IDLE]: {
    texture: TEXTURE,
    key: Animations.IDLE,
    prefix: "idle/__grey_rat_idle_back_",
    start: 0,
    end: 17,
    frameRate: 8,
    repeat: -1,
  },
  [Animations.WALK]: {
    texture: TEXTURE,
    key: Animations.WALK,
    prefix: "move/__grey_rat_move_back_",
    start: 0,
    end: 7,
    frameRate: 8,
    repeat: -1,
  },
  [Animations.DIE]: {
    texture: TEXTURE,
    key: Animations.DIE,
    prefix: "die/__grey_rat_die_back_",
    start: 0,
    end: 6,
    frameRate: 8,
    repeat: 0,
  },
};

export class Rat extends Physics.Arcade.Sprite {
  scene: Scene;
  keys: Types.Input.Keyboard.CursorKeys;
  joystickKeys: Types.Input.Keyboard.CursorKeys;
  target: Target;
  hasTarget: boolean;
  isDead: boolean;
  currentTile: MazeTile;
  maze: Maze;
  joystick: Joystick;
  debug: ReturnType<typeof debug>;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    target: Target,
    maze: Maze,
    joystick: Joystick
  ) {
    super(scene, x, y, TEXTURE, 0);
    this.debug = debug("rat");
    this.target = target;
    this.scene = scene;
    this.maze = maze;
    this.joystick = joystick;
    this.name = "rat";
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setupKeys();
    this.setupAnimations();
    this.play(Animations.IDLE);
    subscribe(EventNames.TARGET_REACHED, () => this.hasReachedTarget());
    subscribe(EventNames.CAUGHT, () => this.die());
  }

  static load(scene: Scene) {
    scene.load.atlas(TEXTURE, ATLAS_FILE, ATLAS_JSON);
  }

  setupKeys() {
    this.keys = this.scene.input.keyboard!.createCursorKeys()!;
    this.joystickKeys =
      this.joystick.cursorKeys() as Types.Input.Keyboard.CursorKeys;
  }

  setupAnimations() {
    const anims = Array.from(Object.values(AnimationDefinitions));
    createAnimations(this.scene, anims);
  }

  updateRotation() {
    this.rotation = this.getBody().angle;
  }

  update() {
    if (this.isDead) {
      return;
    }

    const currentTile = this.maze.getTileForCoords(this.x, this.y);
    if (currentTile.id !== this.currentTile?.id) {
      this.currentTile = currentTile;
      this.debug("current tile", this.currentTile.id);
    }
    let isWalking = false;
    this.getBody().setVelocity(0);

    if (this.keys.up.isDown || this.joystickKeys.up.isDown) {
      this.getBody().velocity.y = -SPEED;
      this.updateRotation();
      isWalking = true;
    }
    if (this.keys.down.isDown || this.joystickKeys.down.isDown) {
      this.getBody().velocity.y = SPEED;
      this.updateRotation();
      isWalking = true;
    }
    if (this.keys.right.isDown || this.joystickKeys.right.isDown) {
      this.getBody().velocity.x = SPEED;
      this.updateRotation();
      isWalking = true;
    }
    if (this.keys.left.isDown || this.joystickKeys.left.isDown) {
      this.getBody().velocity.x = -SPEED;
      this.updateRotation();
      isWalking = true;
    }

    if (isWalking) {
      this.play(Animations.WALK, true);
    } else {
      this.play(Animations.IDLE, true);
    }
  }

  hasReachedTarget() {
    this.hasTarget = true;
  }

  die() {
    this.isDead = true;
    this.stop();
    this.getBody().setVelocity(0);
    this.scene.time.delayedCall(500, this.play, [Animations.DIE], this);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
