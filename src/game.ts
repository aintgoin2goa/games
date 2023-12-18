import {
  COLORS,
  FONTS,
  FONT_SIZES,
  HEIGHT,
  WIDTH,
  pieceColors,
  pieceColorsStr,
  pieceTextColor,
} from "./constants";
import { Column, Coord, Piece, Row } from "./types";
import {
  columnRow2Coord,
  getColumnFromCoord,
  getCoords,
  invertPiece,
} from "./utils";
import * as GameMap from "./map";
import { Text } from "./text";
import { WINNER } from "./search";

type UIObject =
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.Graphics
  | Phaser.GameObjects.Zone;
type UIObjectKeys =
  | "title"
  | "win-title"
  | "play-again-btn"
  | "1p-btn"
  | "2p-btn"
  | "p1_zone"
  | "p2_zone"
  | "player1_text"
  | "player2_text"
  | "p1_marker"
  | "p2_marker";
class UIObjects {
  private objects: Map<UIObjectKeys, UIObject>;

  constructor() {
    this.objects = new Map();
  }

  add(name: UIObjectKeys, obj: UIObject) {
    this.objects.set(name, obj);
  }

  get(name: UIObjectKeys): unknown {
    return this.objects.get(name);
  }

  destroy(name: UIObjectKeys) {
    const obj = this.objects.get(name) as UIObject;
    if (obj) {
      obj.destroy();
      this.objects.delete(name);
    }
  }
}

export class Game {
  private scene: Phaser.Scene;

  private pieces: Map<Coord, Phaser.GameObjects.Graphics>;

  private uiObjects: UIObjects;

  private text: Text;

  private currentTurn: Piece;

  private ready: boolean;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.pieces = new Map();
    this.uiObjects = new UIObjects();
    this.text = new Text(scene);
    this.ready = true;
  }

  drawPiece(color: number, x: number, y: number) {
    return this.scene.add
      .graphics()
      .fillStyle(color)
      .fillCircle(x, y, 41)
      .setDepth(-1);
  }

  placePiece(piece: Piece, col: Column, row: Row) {
    const [x, y] = getCoords(col, row);
    const img = this.drawPiece(pieceColors[piece], x, -100);
    this.pieces.set(columnRow2Coord(col, row), img);
    return new Promise<void>((resolve) => {
      this.scene.tweens.add({
        targets: img,
        y,
        duration: 500,
        delay: 0,
        ease: "Bounce.Out",
        onComplete: () => setTimeout(resolve, 100),
      });
    });
  }

  clearBoard() {
    for (const img of this.pieces.values()) {
      img.destroy();
    }

    this.pieces.clear();
  }

  flash(coords: Coord[]) {
    const imgs = coords.map((c) => this.pieces.get(c));

    imgs.forEach((img, index) => {
      this.scene.tweens.add({
        targets: img,
        yoyo: true,
        delay: 25 * index,
        alpha: 0.5,
        repeat: 100,
        duration: 100,
      });
    });
  }

  winner(piece: Piece, coords: Coord[]) {
    this.flash(coords);
    this.uiObjects.add(
      "win-title",
      this.text.title(`${piece} wins!`, pieceColorsStr[piece]),
    );
    this.uiObjects.destroy("p1_marker");
    this.uiObjects.destroy("p2_marker");
    this.uiObjects.destroy("player1_text");
    this.uiObjects.destroy("player2_text");
    this.uiObjects.add(
      "play-again-btn",
      this.text
        .button({
          x: WIDTH / 2,
          y: HEIGHT / 2,
          text: "Play Again",
          backgroundColor: pieceColorsStr[piece],
          color: pieceTextColor[piece],
        })
        .on("pointerdown", () => {
          GameMap.clear();
          this.clearBoard();
          this.uiObjects.destroy("win-title");
          this.uiObjects.destroy("play-again-btn");
          this.start();
        }),
    );
  }

  start() {
    this.uiObjects.add("title", this.text.title("CONNECT4", COLORS.white));
    this.uiObjects.add(
      "1p-btn",
      this.text
        .button({
          x: 200,
          y: HEIGHT - 100,
          backgroundColor: COLORS.red,
          color: COLORS.white,
          text: "One Player",
        })
        .on("pointerdown", () => {
          // begin(1)
        }),
    );
    this.uiObjects.add(
      "2p-btn",
      this.text
        .button({
          x: WIDTH - 200,
          y: HEIGHT - 100,
          backgroundColor: COLORS.red,
          color: COLORS.white,
          text: "Two Player",
        })
        .on("pointerdown", () => {
          this.begin(2);
        }),
    );
  }

  begin(players: 1 | 2) {
    let ready = true;
    this.currentTurn = "red";
    this.uiObjects.destroy("title");
    this.uiObjects.destroy("1p-btn");
    this.uiObjects.destroy("2p-btn");
    this.uiObjects.add(
      "player1_text",
      this.text.label({
        x: 10,
        y: HEIGHT - 25,
        color: pieceColorsStr.red,
        text: "Player 1",
      }),
    );
    this.uiObjects.add(
      "p1_marker",
      this.drawPiece(pieceColors.red, 50, HEIGHT - 70),
    );
    this.uiObjects.add(
      "player2_text",
      this.text.label({
        x: WIDTH - 90,
        y: HEIGHT - 25,
        color: pieceColorsStr.yellow,
        text: players === 2 ? "Player 2" : "Computer",
      }),
    );
    this.uiObjects.add(
      "p2_marker",
      this.drawPiece(pieceColors.yellow, WIDTH - 50, HEIGHT - 70),
    );
    this.nextTurn("red");
  }

  nextTurn(piece: Piece) {
    this.currentTurn = piece;
    const lowAlpha = 0.3;
    if (piece === "red") {
      (this.uiObjects.get("p1_marker") as Phaser.GameObjects.Graphics).setAlpha(
        1,
      );
      (this.uiObjects.get("p2_marker") as Phaser.GameObjects.Graphics).setAlpha(
        lowAlpha,
      );
      (this.uiObjects.get("player1_text") as Phaser.GameObjects.Text).setAlpha(
        1,
      );
      (this.uiObjects.get("player2_text") as Phaser.GameObjects.Text).setAlpha(
        lowAlpha,
      );
    } else {
      (this.uiObjects.get("p1_marker") as Phaser.GameObjects.Graphics).setAlpha(
        lowAlpha,
      );
      (this.uiObjects.get("p2_marker") as Phaser.GameObjects.Graphics).setAlpha(
        1,
      );
      (this.uiObjects.get("player1_text") as Phaser.GameObjects.Text).setAlpha(
        lowAlpha,
      );
      (this.uiObjects.get("player2_text") as Phaser.GameObjects.Text).setAlpha(
        1,
      );
    }
    this.scene.input.once("pointerdown", (pointer) => {
      this.takeTurn(pointer);
    });
  }

  takeTurn(pointer) {
    const column = getColumnFromCoord(pointer.x);
    const row = GameMap.getNextAvailableRowForColumn(column);
    const piece = this.currentTurn;

    if (!row) {
      console.log("No row found");
      return;
    }
    this.placePiece(piece, column, row).then(() => {
      GameMap.update(column, row, piece);
      const winnerSearch = GameMap.search(WINNER, piece);
      if (winnerSearch.found) {
        this.winner(piece, winnerSearch.coords);
      } else {
        this.nextTurn(invertPiece(piece));
      }
    });
  }
}
