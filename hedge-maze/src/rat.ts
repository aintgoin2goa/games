import { Physics, Scene, Types, Math } from "phaser";
import { Target } from "./target";
import { DebuggerCollection, MazeTile, TargetPoint } from "./types";
import { Maze } from "./maze";
import debug from "debug";
import { Animation, createAnimations } from "./lib/animations";
import { Controls } from "./controls";

const TEXTURE = "hero";
const ATLAS_FILE = "sprites/rat.png";
const ATLAS_JSON = "sprites/rat.json";

const SPEED = 600;

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
  debug: DebuggerCollection<"update" | "physics" | "movement">;
  keys: Types.Input.Keyboard.CursorKeys;
  target: Target;
  maze: Maze;
  hasTarget: boolean;
  isDead: boolean;

  currentTile: MazeTile;
  controls: Controls;
  moveTarget?: TargetPoint;

  constructor(scene: Scene, x: number, y: number, target: Target, maze: Maze) {
    super(scene, x, y, TEXTURE, 0);
    this.name = "rat";
    this.scene = scene;
    this.debug = {
      update: debug("rat:update"),
      physics: debug("rat:physics"),
      movement: debug("rat:movement"),
    };
    this.target = target;
    this.maze = maze;
    this.isDead = false;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().onCollide = true;
    this.getBody().onOverlap = true;
    this.setupControls();
    this.setupAnimations();
    this.play(Animations.IDLE);
  }

  static load(scene: Scene) {
    scene.load.atlas(TEXTURE, ATLAS_FILE, ATLAS_JSON);
  }

  setupControls() {
    this.keys = this.scene.input.keyboard!.createCursorKeys()!;
    this.scene.input.on("pointerdown", (pointer) => {
      this.moveTo({ x: pointer.worldX, y: pointer.worldY });
    });
  }

  setupAnimations() {
    const anims = Array.from(Object.values(AnimationDefinitions));
    createAnimations(this.scene, anims);
  }

  updateRotation() {
    this.rotation = this.getBody().angle;
  }

  moveTo(point: TargetPoint) {
    if (this.isDead) {
      return;
    }

    this.debug.movement("moveTo", point);
    this.play(Animations.WALK, true);
    this.moveTarget = point;
    this.scene.physics.moveToObject(this, point, SPEED);
    this.updateRotation();
  }

  hasReachedMoveTarget() {
    if (!this.moveTarget) {
      return false;
    }
    const distance = Math.Distance.BetweenPoints(this, this.moveTarget);
    this.debug.update(
      "hasReachedMoveTarget",
      this.moveTarget,
      { x: this.x, y: this.y },
      distance
    );

    return distance < 3;
  }

  onCollision() {
    this.debug.physics("collision");
    this.getBody().setVelocity(0);
    this.stop();
    this.play(Animations.IDLE);
    this.moveTarget = null;
  }

  update() {
    if (this.isDead) {
      return;
    }

    const currentTile = this.maze.getTileForCoords(this.x, this.y);
    if (currentTile.id !== this.currentTile?.id) {
      this.currentTile = currentTile;
      this.debug.update("current tile", this.currentTile.id);
    }

    let isWalking = false;

    if (this.moveTarget) {
      if (this.hasReachedMoveTarget()) {
        this.getBody().setVelocity(0);
        this.moveTarget = null;
      } else {
        isWalking = true;
        this.updateRotation();
      }
    } else {
      this.getBody().setVelocity(0);
    }

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
      this.play(Animations.IDLE, true);
    }
  }

  hasReachedTarget() {
    this.hasTarget = true;
  }

  die() {
    this.debug.update("DEAD");
    this.isDead = true;
    this.stop();
    this.getBody().setVelocity(0);
    this.moveTarget = null;
    this.play(Animations.DIE);
    // this.scene.time.delayedCall(500, this.play, [Animations.DIE], this);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
