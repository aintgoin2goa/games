import { Scene } from "phaser";
import { Maze, MazeOptions } from "../maze";
import { Hero } from "../hero";
import { TileMap } from "../tilemap";
import { Target } from "../target";
import { Level, Point } from "../types";
import { Levels } from "../lib/constants";
import * as state from "../state";

export type SceneData = {
  level: number;
};

export default class MazeScene extends Scene {
  private hero: Hero;
  private target: Target;
  controls: Phaser.Cameras.Controls.FixedKeyControl;

  level: Level;

  constructor() {
    super("maze");
  }

  get size() {
    return this.level.size;
  }

  preload() {
    Hero.load(this);
    Maze.load(this);
    Target.load(this);
  }

  init() {
    this.level = Levels[state.get("level")];
  }

  create() {
    const options: MazeOptions = {
      maze: {
        width: this.size.w,
        height: this.size.h,
      },
    };

    const start: Point = {
      column: 0,
      row: 0,
    };

    const { target } = this.level;
    const maze = new Maze(this, options);
    maze.generate();
    const map = new TileMap(this, maze, this.size);

    const startCoords = maze.getTileCoords(start.column, start.row);
    const endCoords = maze.getTileCoords(target.column, target.row);

    // solution
    maze.solve(start, target);

    // goal
    this.target = new Target(this, endCoords.x.mid, endCoords.y.mid);

    this.hero = new Hero(
      this,
      startCoords.x.mid,
      startCoords.y.mid,
      this.target
    );

    this.physics.add.collider(map.layer, this.hero);
    this.physics.add.overlap(this.hero, this.target);
    this.physics.world.once("overlap", (hero: Hero, target: Target) => {
      hero.hasReachedTarget();
      target.reached();
      map.revealExit();
    });
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.map.widthInPixels, map.map.heightInPixels);
    camera.startFollow(this.hero);
    camera.setZoom(0.5, 0.5);
  }

  update(): void {
    this.hero.update();
    if (this.hero.x < 0) {
      if (this.hero.hasTarget) {
        state.incrementLevel();
        if (state.get("level") >= Levels.length) {
          alert("Game complete!");
          this.scene.start("welcome");
        }

        this.scene.start("level");
      }
    }
  }
}
