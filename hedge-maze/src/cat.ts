import { Math, Physics, Scene } from "phaser";
import { Maze } from "./maze";
import { Directions, MazeCell, MazeTile } from "./types";
import { turn180Degrees, turn90DegreesLeft, turn90DegreesRight } from "./utils";

const TEXTURE = "cat";
const FILE = ["sprites/cat-0.png"];

const WALKING_SPEED = 200;
// const RUNNING_SPEED = 400;

enum Animations {
  IDLE = "cat_idle",
  SIT = "cat_sit",
  WALK = "cat_walk",
  LOOK_LEFT = "cat_look_left",
  LOOK_RIGHT = "cat_look_right",
}

const Angles: Record<Directions, number> = {
  left: 180,
  right: 0,
  up: -90,
  down: 90,
};

export type TargetTile = {
  x: number;
  y: number;
  tile: MazeTile;
};

export class Cat extends Physics.Arcade.Sprite {
  currentAction: Animations;
  currentlyFacing: Directions;
  lastChangeOfAction: number = Date.now();
  target: TargetTile | null;
  currentTile: MazeTile;
  maze: Maze;
  timer: Phaser.Time.TimerEvent;

  constructor(scene: Scene, maze: Maze) {
    const tile = maze.getRandomTile();
    const coords = maze.getTileCoords(tile.point.column, tile.point.row);
    super(scene, coords.x.mid, coords.y.mid, TEXTURE, 0);
    this.scene = scene;
    this.maze = maze;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setupAnimations();
    this.currentTile = tile;
    this.setStartingPosition(tile.cell);
    this.sit();
    this.scene.time.delayedCall(5000, this.decideWhatToDo, undefined, this);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }

  static load(scene: Scene) {
    scene.load.atlas("cat", FILE, "sprites/cat.json");
  }

  setStartingPosition(cell: MazeCell) {
    console.log("setStartingPosition", cell);
    if (!cell.left) {
      this.turnToFace("left");
    } else if (!cell.up) {
      this.turnToFace("up");
    } else if (!cell.right) {
      this.turnToFace("right");
    } else {
      this.turnToFace("down");
    }
  }

  setupAnimations() {
    this.scene.anims.create({
      key: Animations.IDLE,
      frames: this.anims.generateFrameNames(TEXTURE, {
        prefix: "idle/__black_cat_idle_",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: Animations.SIT,
      frames: this.anims.generateFrameNames(TEXTURE, {
        prefix: "sit/__black_cat_sitting_idle_",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: Animations.WALK,
      frames: this.anims.generateFrameNames(TEXTURE, {
        prefix: "walk/__black_cat_walk_",
        suffix: ".png",
        start: 0,
        end: 7,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: Animations.LOOK_LEFT,
      frames: this.anims.generateFrameNames(TEXTURE, {
        prefix: "look_left/__black_cat_look_left_",
        suffix: ".png",
        start: 0,
        end: 6,
        zeroPad: 3,
      }),
      frameRate: 8,
    });
    this.scene.anims.create({
      key: Animations.LOOK_RIGHT,
      frames: this.anims.generateFrameNames(TEXTURE, {
        prefix: "look_right/__black_cat_look_right_",
        suffix: ".png",
        start: 0,
        end: 6,
        zeroPad: 3,
      }),
      frameRate: 8,
    });
  }

  turnToFace(dir: Directions) {
    console.log("turnToFace", dir, Angles);
    this.angle = Angles[dir];
    this.currentlyFacing = dir;
  }

  stand() {
    this.stop();
    this.play(Animations.IDLE);
    this.currentAction = Animations.IDLE;
    this.lastChangeOfAction = Date.now();
  }

  sit() {
    this.stop();
    this.play(Animations.SIT);
    this.currentAction = Animations.SIT;
    this.lastChangeOfAction = Date.now();
  }

  walk(targetTile: MazeTile) {
    console.log("walk", { targetTile });
    const coords = this.maze.getTileCoords(
      targetTile.point.column,
      targetTile.point.row
    );
    this.target = { x: coords.x.mid, y: coords.y.mid, tile: targetTile };
    this.stop();
    this.play(Animations.WALK);
    this.scene.physics.moveToObject(this, this.target, WALKING_SPEED);
  }

  hasArrived() {
    if (this.target === null) {
      return;
    }
    this.getBody().reset(this.x, this.y);
    this.stop();
    this.currentTile = this.target.tile;
    console.log("stopMoving");
    this.play(Animations.IDLE);
    this.target = null;
    console.log("current tile", this.currentTile);
    this.decideWhatToDo();
  }

  lookStraightAhead() {
    return this.maze.getVisibleTiles(this.currentTile, this.currentlyFacing);
  }

  async look(where: "left" | "right"): Promise<MazeTile[]> {
    let animation: string | undefined;
    let fn: (dir: Directions) => Directions;
    if (where === "left") {
      animation = Animations.LOOK_LEFT;
      fn = turn90DegreesLeft;
    } else if (where === "right") {
      animation = Animations.LOOK_RIGHT;
      fn = turn90DegreesRight;
    } else {
      fn = turn180Degrees;
    }

    if (animation) {
      this.play(animation);
    }

    const dir = fn(this.currentlyFacing);
    const tiles = this.maze.getVisibleTiles(this.currentTile, dir);
    return new Promise((resolve) =>
      this.once("animationcomplete", () => resolve(tiles))
    );
  }

  lookBehind() {
    const dir = turn180Degrees(this.currentlyFacing);
    return this.maze.getVisibleTiles(this.currentTile, dir);
  }

  turnLeft() {
    this.turnToFace(turn90DegreesLeft(this.currentlyFacing));
  }

  turnRight() {
    this.turnToFace(turn90DegreesRight(this.currentlyFacing));
  }

  turnAround() {
    this.turnToFace(turn180Degrees(this.currentlyFacing));
  }

  async decideWhatToDo() {
    console.log("decide what to do");
    const tilesAhead = this.lookStraightAhead();
    console.log("look ahead", tilesAhead);
    if (tilesAhead.length > 1) {
      const targetTile = tilesAhead[tilesAhead.length - 1];
      console.log("walk ahead", targetTile.point);
      return this.walk(targetTile);
    }

    const tilesToLeft = await this.look("left");
    console.log("look left", tilesToLeft);
    if (tilesToLeft.length > 1) {
      const targetTile = tilesToLeft[tilesToLeft.length - 1];
      console.log("turn left and walk", targetTile.point);
      this.turnLeft();
      return this.walk(targetTile);
    }

    const tilesToRight = await this.look("right");
    console.log("look right", tilesToRight);
    if (tilesToRight.length > 1) {
      const targetTile = tilesToRight[tilesToRight.length - 1];
      console.log("turn right and walk", targetTile.point);
      this.turnRight();
      return this.walk(targetTile);
    }

    const tilesBehind = await this.lookBehind();
    console.log("look behind", tilesBehind);
    if (tilesBehind.length > 1) {
      const targetTile = tilesBehind[tilesBehind.length - 1];
      console.log("turn around and walk", targetTile.point);
      this.turnAround();
      return this.walk(targetTile);
    }
  }

  update() {
    if (this.target) {
      const distance = Math.Distance.BetweenPoints(this, this.target);
      if (distance < 3) {
        this.hasArrived();
      }
    }
  }
}
