import { Scene } from "phaser";
import { Maze, MazeOptions, Point } from "../maze";
import { SIZE_X, SIZE_Y } from "../constants";
import { Hero } from "../hero";
import { TileMap } from "../tilemap";

export default class MazeScene extends Scene {
  private hero: Hero;
  controls: Phaser.Cameras.Controls.FixedKeyControl;

  constructor() {
    super("maze");
  }

  preload() {
    Hero.load(this);
    Maze.load(this);
    this.load.image("trophy", "img/trophy.png");
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
    console.log(map.data);

    const start: Point = {
      row: 0,
      column: 0,
    };
    const end: Point = {
      row: 5,
      column: 5,
    };

    const startCoords = maze.getTileCoords(start.column, start.row);
    const endCoords = maze.getTileCoords(end.column, end.row);

    // solution
    maze.solve(start, end);
    // const firstPoint = pathPoints.shift()!;
    // const path = new Phaser.Curves.Path(firstPoint.x.mid, firstPoint.y.mid);
    // for (const point of pathPoints) {
    //   path.lineTo(point.x.mid, point.y.mid);
    // }
    // const graphics = this.add
    //   .graphics()
    //   .lineStyle(5, colorFor(COLOR_USE_CASES.PATH).toNumber(), 1);
    // path.draw(graphics);

    // goal
    this.add.image(endCoords.x.mid, endCoords.y.mid, "trophy");

    this.hero = new Hero(this, startCoords.x.mid, startCoords.y.mid);
    this.physics.add.collider(map.layer, this.hero);
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.map.widthInPixels, map.map.heightInPixels);
    camera.startFollow(this.hero);
    camera.setZoom(0.5, 0.5);
  }

  update(): void {
    this.hero.update();
  }
}
