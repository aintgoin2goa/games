import { Scene } from "phaser";
import { Maze, MazeOptions, Point } from "../maze";
import { SIZE_X, SIZE_Y } from "../lib/constants";
import { Hero } from "../hero";
import { TileMap } from "../tilemap";
import { Target } from "../target";

export default class MazeScene extends Scene {
  private hero: Hero;
  private target: Target;
  controls: Phaser.Cameras.Controls.FixedKeyControl;

  constructor() {
    super("maze");
  }

  preload() {
    Hero.load(this);
    Maze.load(this);
    Target.load(this);
  }

  create() {
    const options: MazeOptions = {
      maze: {
        width: SIZE_X,
        height: SIZE_Y,
      },
    };

    const maze = new Maze(this, options);
    maze.generate();
    const map = new TileMap(this, maze);

    const start: Point = {
      row: 0,
      column: 0,
    };
    const end: Point = {
      row: 0,
      column: 1,
    };

    const startCoords = maze.getTileCoords(start.column, start.row);
    const endCoords = maze.getTileCoords(end.column, end.row);

    // solution
    maze.solve(start, end);

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
    });
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.map.widthInPixels, map.map.heightInPixels);
    camera.startFollow(this.hero);
    camera.setZoom(0.5, 0.5);
  }

  update(): void {
    this.hero.update();
  }
}
