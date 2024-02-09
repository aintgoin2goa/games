import { Math, Physics, Scene } from "phaser";
import { Maze } from "./maze";
import { DebuggerCollection, Directions, MazeCell, MazeTile } from "./types";
import { turn180Degrees, turn90DegreesLeft, turn90DegreesRight } from "./utils";
import debug from "debug";
import { Rat } from "./rat";
import MazeScene from "./scenes/MazeScene";
import { Animation, createAnimations } from "./lib/animations";

const TEXTURE = "cat";
const FILE = ["sprites/black-cat-0.png"];
const ATLAS = "sprites/black-cat.json";

const WALKING_SPEED = 200;
const RUNNING_SPEED = 600;

const DAZED_TIME = 2000;

const MAX_TILES_IN_VIEW = 5;

enum Animations {
  IDLE = "cat_idle",
  SIT = "cat_sit",
  WALK = "cat_walk",
  LOOK_LEFT = "cat_look_left",
  LOOK_RIGHT = "cat_look_right",
  RUN = "cat_run",
  DAZED = "cat_dazed",
}

const AnimationDefinitions: Record<Animations, Animation> = {
  [Animations.IDLE]: {
    key: Animations.IDLE,
    texture: TEXTURE,
    prefix: "idle/__black_cat_idle_",
    start: 0,
    end: 19,
    frameRate: 8,
    repeat: -1,
  },
  [Animations.SIT]: {
    key: Animations.SIT,
    texture: TEXTURE,
    prefix: "sit/__black_cat_sitting_idle_",
    start: 0,
    end: 10,
    frameRate: 8,
    repeat: -1,
  },
  [Animations.WALK]: {
    key: Animations.WALK,
    texture: TEXTURE,
    prefix: "walk/__black_cat_walk_",
    start: 0,
    end: 7,
    frameRate: 8,
    repeat: -1,
  },
  [Animations.RUN]: {
    key: Animations.RUN,
    texture: TEXTURE,
    prefix: "run/__black_cat_run_",
    start: 0,
    end: 7,
    frameRate: 16,
    repeat: -1,
  },
  [Animations.LOOK_LEFT]: {
    key: Animations.LOOK_LEFT,
    texture: TEXTURE,
    prefix: "look_left/__black_cat_look_left_",
    start: 0,
    end: 6,
    frameRate: 8,
    repeat: 0,
  },
  [Animations.LOOK_RIGHT]: {
    key: Animations.LOOK_RIGHT,
    texture: TEXTURE,
    prefix: "look_right/__black_cat_look_right_",
    start: 0,
    end: 6,
    frameRate: 8,
    repeat: 0,
  },
  [Animations.DAZED]: {
    key: Animations.DAZED,
    texture: TEXTURE,
    prefix: "dazed/__black_cat_whacked_",
    start: 0,
    end: 15,
    frameRate: 16,
    repeat: -1,
  },
};

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
  isChasing: boolean;
  isDazed: boolean;
  target: TargetTile | null;
  currentTile: MazeTile;
  currentView: MazeTile[];
  maze: Maze;
  rat: Rat;
  scene: MazeScene;
  timer: Phaser.Time.TimerEvent;
  debug: DebuggerCollection<"vision" | "decisions" | "movement" | "fov">;

  constructor(scene: MazeScene, maze: Maze, rat: Rat) {
    const tile = maze.getRandomTile();
    const coords = maze.getTileCoords(tile.point.column, tile.point.row);
    super(scene, coords.x.mid, coords.y.mid, TEXTURE, 0);
    this.name = "cat";
    this.debug = {
      vision: debug("cat:vision"),
      decisions: debug("cat:decisions"),
      movement: debug("cat:movement"),
      fov: debug("cat:fov"),
    };
    this.scene = scene;
    this.maze = maze;
    this.rat = rat;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().onOverlap = true;
    this.getBody().onCollide = true;
    this.setupAnimations();
    this.currentTile = tile;
    this.isChasing = false;
    this.setStartingPosition(tile.cell);
    this.sit(5000).then(() => this.decideWhatToDo());
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }

  static load(scene: Scene) {
    scene.load.atlas(TEXTURE, FILE, ATLAS);
  }

  updateRotation() {}

  setStartingPosition(cell: MazeCell) {
    this.debug.movement("setStartingPosition", cell);
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
    const anims = Array.from(Object.values(AnimationDefinitions));
    createAnimations(this.scene, anims);
  }

  onCollision() {
    this.currentTile = this.maze.getTileForCoords(this.x, this.y);
    const coords = this.maze.getTileCoords(
      this.currentTile.point.column,
      this.currentTile.point.row
    );
    this.setX(coords.x.mid);
    this.setY(coords.y.mid);
    this.isChasing = false;
    this.stop();
    this.setVelocity(0);
    this.play(Animations.DAZED);
    this.isDazed = true;
    this.setStartingPosition(this.currentTile.cell);
    this.scene.time.delayedCall(
      DAZED_TIME,
      () => {
        this.stop();
        this.isDazed = false;
        this.sit(1000).then(() => this.decideWhatToDo());
      },
      undefined,
      this
    );
  }

  updateCurrentView() {
    if (!this.scene?.getVisibleTilesWithRat) {
      return;
    }
    this.currentView = this.scene.getVisibleTilesWithRat(
      this.maze.getTileForCoords(this.x, this.y),
      this.currentlyFacing,
      MAX_TILES_IN_VIEW
    );
    this.debug.vision(
      "currentView",
      this.currentView,
      this.currentView.map((t) => ({ id: t.id, hasRat: t.hasRat }))
    );
    const tileWithRat = this.currentView.find((v) => v.hasRat);
    if (tileWithRat) {
      if (!this.isChasing) {
        this.debug.fov("SPOTTED RAT");
        this.chase();
      }
    }
  }
  turnToFace(dir: Directions) {
    this.debug.movement("turnToFace", dir);
    this.angle = Angles[dir];
    this.currentlyFacing = dir;
  }

  stand() {
    this.stop();
    this.play(Animations.IDLE);
  }

  async sit(duration: number) {
    this.stop();
    this.play(Animations.SIT);
    return new Promise((r) =>
      this.scene.time.delayedCall(duration, r, undefined, this)
    );
  }

  walk(targetTile: MazeTile) {
    this.debug.movement("walk", { targetTile });
    const coords = this.maze.getTileCoords(
      targetTile.point.column,
      targetTile.point.row
    );
    this.target = { x: coords.x.mid, y: coords.y.mid, tile: targetTile };
    this.stop();
    this.play(Animations.WALK);
    this.scene.physics.moveToObject(this, this.target, WALKING_SPEED);
  }

  chase() {
    this.isChasing = true;
    this.stop();
    this.play(Animations.RUN);
  }

  hasArrived() {
    if (this.target === null) {
      return;
    }
    this.getBody().reset(this.x, this.y);
    this.stop();
    this.currentTile = this.maze.getTileForCoords(this.x, this.y);
    this.debug.movement("stopMoving", { currentTile: this.currentTile });
    this.play(Animations.IDLE);
    this.target = null;
    this.decideWhatToDo();
  }

  async look(where: "left" | "right"): Promise<MazeTile[]> {
    const animation =
      where === "left" ? Animations.LOOK_LEFT : Animations.LOOK_RIGHT;
    this.play(animation);
    return new Promise((resolve) => this.once("animationcomplete", resolve));
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
    const tilesAhead = this.maze.getVisibleTiles(
      this.currentTile,
      this.currentlyFacing,
      MAX_TILES_IN_VIEW
    );
    const tilesToLeft = this.maze.getVisibleTiles(
      this.currentTile,
      turn90DegreesLeft(this.currentlyFacing),
      MAX_TILES_IN_VIEW
    );
    const tilesToRight = this.maze.getVisibleTiles(
      this.currentTile,
      turn90DegreesRight(this.currentlyFacing),
      MAX_TILES_IN_VIEW
    );
    const tilesBehind = this.maze.getVisibleTiles(
      this.currentTile,
      turn180Degrees(this.currentlyFacing),
      MAX_TILES_IN_VIEW
    );

    this.debug.decisions("decide what to do", {
      tilesAhead,
      tilesBehind,
      tilesToLeft,
      tilesToRight,
    });

    if (
      tilesAhead.length < 2 &&
      tilesToLeft.length < 2 &&
      tilesToRight.length < 2
    ) {
      this.debug.decisions("No tiles ahead, left or right");
      if (tilesBehind.length < 2) {
        this.debug.decisions("No tiles behind as well, something went wrong!", {
          currentTile: this.currentTile,
          tilesToLeft,
          tilesToRight,
          tilesBehind,
          tilesAhead,
        });
        throw new Error("No way for cat to go!");
      }
      const targetTile = tilesBehind[1];
      this.debug.decisions("turn around and walk", targetTile.point);
      this.turnAround();
      await this.sit(1000);
      return this.walk(targetTile);
    }

    if (tilesToLeft.length > 1) {
      await this.look("left");
    }

    if (tilesToRight.length > 1) {
      await this.look("right");
    }

    if (
      tilesToRight.length > tilesToLeft.length &&
      tilesToRight.length > tilesAhead.length
    ) {
      const target = tilesToRight[1];
      this.debug.decisions("turn right and walk", target.point);
      this.turnRight();
      this.walk(target);
      return;
    }

    if (tilesToLeft.length > tilesAhead.length) {
      const target = tilesToLeft[1];
      this.debug.decisions("turn left and walk", target.point);
      this.turnLeft();
      this.walk(target);
      return;
    }

    this.debug.decisions("walk ahead");
    const target = tilesAhead[1];
    this.walk(target);
  }

  update() {
    if (!this.scene) {
      return;
    }

    if (this.isChasing) {
      this.scene.physics?.moveToObject(this, this.scene.rat, RUNNING_SPEED);
      this.rotation = this.getBody()?.angle;
    }

    this.updateCurrentView();
    if (this.target) {
      const distance = Math.Distance.BetweenPoints(this, this.target);
      if (distance < 3) {
        this.hasArrived();
      }
    }
  }
}
