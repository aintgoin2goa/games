import { Physics, Scene } from "phaser";
import { Maze, MazeOptions } from "../maze";
import { Rat } from "../rat";
import { TileMap } from "../tilemap";
import { Target } from "../target";
import {
  DebuggerCollection,
  Directions,
  Level,
  MazeTile,
  Point,
} from "../types";
import { Levels } from "../lib/levels";
import * as state from "../state";
import { Cat } from "../cat";
import debug from "debug";
import { isCat, isRat, isTarget } from "../utils";

export type SceneData = {
  level: number;
};

export default class MazeScene extends Scene {
  rat: Rat;
  target: Target;
  controls: Phaser.Cameras.Controls.FixedKeyControl;
  cats: Cat[];
  maze: Maze;
  debug: DebuggerCollection<"physics" | "zoom">;
  zoom: number;

  level: Level;

  constructor() {
    super("maze");
    this.cats = [];
    this.debug = {
      physics: debug("maze:physics"),
      zoom: debug("maze:zoom"),
    };
    this.zoom = 5;
  }

  get size() {
    return this.level.size;
  }

  preload() {
    Rat.load(this);
    Maze.load(this);
    Target.load(this);
    Cat.load(this);
  }

  init() {
    this.level = Levels[state.get("level")];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVisibleTiles(start: MazeTile, dir: Directions): MazeTile[] {
    const tiles = this.maze.getVisibleTiles(start, dir);
    const ratTile = this.rat.currentTile;
    return tiles.map((t) => {
      t.hasRat = ratTile?.id === t.id;
      return t;
    });
  }

  create() {
    this.input.keyboard?.on("keydown-P", () => {
      if (this.scene.isPaused("maze")) {
        this.scene.resume("maze");
        console.log("resumed");
      } else {
        this.scene.pause("maze");
        console.log("paused");
      }
    });

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

    const { target, cats } = this.level;
    this.maze = new Maze(this, options);
    this.maze.generate();
    const map = new TileMap(this, this.maze, this.size);

    const startCoords = this.maze.getTileCoords(start.column, start.row);
    const endCoords = this.maze.getTileCoords(target.column, target.row);

    // solution
    this.maze.solve(start, target);

    this.target = new Target(this, endCoords.x.mid, endCoords.y.mid);

    this.rat = new Rat(
      this,
      startCoords.x.mid,
      startCoords.y.mid,
      this.target,
      this.maze
    );

    this.physics.add.collider(map.layer, this.rat);
    this.physics.add.overlap(this.rat, this.target);
    this.physics.world.on("overlap", (obj1: Rat | Cat, obj2: Target | Rat) => {
      this.debug.physics("OVERLAP", { obj1, obj2 });
      if (isRat(obj1) && isTarget(obj2)) {
        obj1.hasReachedTarget();
        obj2.reached();
        map.revealExit();
        return;
      }

      if (isCat(obj1) && isRat(obj2)) {
        this.scene.start("level", { text: "Caught!", buttonText: "TRY AGAIN" });
      }
    });
    this.physics.world.on("tilecollide", (obj: Physics.Arcade.Sprite) => {
      if (isCat(obj)) {
        this.debug.physics("CAT COLLISON");
        obj.onCollision();
      }
    });

    for (let i = 0; i < cats; i++) {
      const cat = new Cat(this, this.maze, this.rat);
      this.physics.add.collider(map.layer, cat);
      this.physics.add.overlap(cat, this.rat);
      this.cats.push(cat);
    }

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.map.widthInPixels, map.map.heightInPixels);
    camera.startFollow(this.cats[0]);
    camera.setZoom(this.zoom / 10);

    this.input.keyboard!.on("keydown", (e) => {
      if (e.key === "-" && this.zoom > 1) {
        this.zoom--;
      } else if (e.key === "+" && this.zoom < 10) {
        this.zoom++;
      }

      this.debug.zoom(this.zoom);
      camera.zoomTo(this.zoom / 10, 100);
    });
  }

  update(): void {
    this.rat.update();
    this.cats.forEach((c) => c.update());
    if (this.rat.x < 0) {
      if (this.rat.hasTarget) {
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
