import { Scene } from "phaser";
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
import { HEIGHT, INITIAL_ZOOM, WIDTH } from "../lib/constants";
import { button } from "../lib/typography";

export type SceneData = {
  level: number;
};

export default class MazeScene extends Scene {
  rat: Rat;
  target: Target;
  controls: Phaser.Cameras.Controls.FixedKeyControl;
  cats: Cat[];
  maze: Maze;
  map: TileMap;
  debug: DebuggerCollection<"physics" | "zoom">;
  M: Phaser.Input.Keyboard.Key | undefined;

  level: Level;

  constructor() {
    super("maze");
    this.cats = [];
    this.debug = {
      physics: debug("maze:physics"),
      zoom: debug("maze:zoom"),
    };
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
  getVisibleTilesWithRat(
    start: MazeTile,
    dir: Directions,
    maxTiles: number
  ): MazeTile[] {
    const tiles = this.maze.getVisibleTiles(start, dir, maxTiles);
    if (this.rat.isDead) {
      return tiles;
    }
    const ratTile = this.rat.currentTile;
    return tiles.map((t) => {
      t.hasRat = ratTile?.id === t.id;
      return t;
    });
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

    const { target, cats } = this.level;
    this.maze = new Maze(this, options);
    this.maze.generate();
    this.map = new TileMap(this, this.maze, this.size);

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

    this.physics.add.collider(this.map.layer, this.rat);
    this.physics.add.overlap(this.rat, this.target);
    this.physics.world.on("overlap", this.onOverlap.bind(this));
    this.physics.world.on("tilecollide", this.onTileCollide.bind(this));

    for (const catInfo of cats) {
      const cat = new Cat(this, this.maze, this.rat, catInfo.start);
      this.physics.add.collider(this.map.layer, cat);
      this.physics.add.overlap(cat, this.rat);
      this.cats.push(cat);
    }

    const camera = this.cameras.main;
    camera.setBounds(
      0,
      0,
      this.map.map.widthInPixels,
      this.map.map.heightInPixels
    );
    camera.startFollow(this.rat);
    camera.setZoom(INITIAL_ZOOM);
    this.M = this.input.keyboard?.addKey("M");
  }

  update(): void {
    this.rat.update();
    this.cats.forEach((c) => c.update());
    if (this.M?.isDown) {
      this.cameras.main.zoom = this.level.mapZoomLevel;
      this.target.setScale(this.level.id + 1 * 2);
    } else {
      this.cameras.main.zoom = INITIAL_ZOOM;
      this.target.setScale(1);
    }
    if (this.rat.x < 0) {
      if (this.rat.hasTarget) {
        state.incrementLevel();
        if (state.get("level") >= Levels.length) {
          state.resetLevel();
          this.scene.start("level", {
            title: "You win!",
            buttonText: "Play Again",
          });
        } else {
          this.scene.start("level", {});
        }
      }
    }
  }

  onOverlap(obj1: unknown, obj2: unknown) {
    this.debug.physics("OVERLAP", { obj1, obj2 });

    if (isRat(obj1) && isTarget(obj2)) {
      this.onTargetReached();
    }

    if (isCat(obj1) && isRat(obj2)) {
      if (obj1.isDazed) {
        return;
      }

      this.onRatCaught(obj1);
    }
  }

  onTileCollide(obj: unknown) {
    if (isCat(obj) || isRat(obj)) {
      this.debug.physics("COLLISION", obj.name, obj);
      obj.onCollision();
      return;
    }

    this.debug.physics("UNKNOWN COLLISION", obj);
  }

  onTargetReached() {
    this.rat.hasReachedTarget();
    this.target.reached();
    this.map.revealExit();
  }

  onRatCaught(cat: Cat) {
    if (this.rat.isDead) return;
    console.log("caught");
    cat.swipe();
    this.rat.die();
    button(this, { x: WIDTH / 2, y: HEIGHT - 100, text: "Try Again" })
      .on("pointerdown", () => {
        this.scene.start("maze");
      })
      .setScrollFactor(0);
  }
}
