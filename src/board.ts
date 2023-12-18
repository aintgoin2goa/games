// import {
//   COLORS,
//   FONTS,
//   FONT_SIZES,
//   HEIGHT,
//   WIDTH,
//   pieceColors,
//   pieceColorsStr,
//   pieceTextColor,
// } from "./constants";
// import { Column, Row, Piece, Coord } from "./types";
// import { columnRow2Coord, getCoords } from "./utils";
// import * as GameMap from "./map";
// import { Text } from "./text";

// const pieces: Map<Coord, Phaser.GameObjects.Graphics> = new Map();

// type UIObject = Phaser.GameObjects.Text | Phaser.GameObjects.Graphics;
// type UIObjectKeys =
//   | "title"
//   | "win-title"
//   | "play-again-btn"
//   | "1p-btn"
//   | "2p-btn";
// class UIObjects {
//   private objects: Map<UIObjectKeys, UIObject>;

//   constructor() {
//     this.objects = new Map();
//   }

//   add(name: UIObjectKeys, obj: UIObject) {
//     this.objects.set(name, obj);
//   }

//   get(name: UIObjectKeys): unknown {
//     return this.objects.get(name);
//   }

//   destroy(name: UIObjectKeys) {
//     const obj = this.objects.get(name) as UIObject;
//     if (obj) {
//       obj.destroy();
//       this.objects.delete(name);
//     }
//   }
// }

// const uiObjects = new UIObjects();

// export const piecePlacer =
//   (scene: Phaser.Scene) =>
//   (piece: Piece, col: Column, row: Row): Promise<void> => {
//     const [x, y] = getCoords(col, row);
//     const img = scene.add
//       .graphics()
//       .fillStyle(pieceColors[piece])
//       .fillCircle(x, -100, 41)
//       .setDepth(-1);

//     pieces.set(columnRow2Coord(col, row), img);
//     return new Promise<void>((resolve) => {
//       scene.tweens.add({
//         targets: img,
//         y,
//         duration: 500,
//         delay: 0,
//         ease: "Bounce.Out",
//         onComplete: () => setTimeout(resolve, 100),
//       });
//     });
//   };

// export const clearBoard = () => {
//   for (const img of pieces.values()) {
//     img.destroy();
//   }

//   pieces.clear();
// };

// export const flash = (scene: Phaser.Scene, coords: Coord[]) => {
//   const imgs = coords.map((c) => pieces.get(c));

//   imgs.forEach((img, index) => {
//     scene.tweens.add({
//       targets: img,
//       yoyo: true,
//       delay: 25 * index,
//       alpha: 0.5,
//       repeat: 100,
//       duration: 100,
//     });
//   });
// };

// export const winner = (scene: Phaser.Scene, piece: Piece, coords: Coord[]) => {
//   flash(scene, coords);
//   uiObjects.add(
//     "win-title",
//     scene.add
//       .text(WIDTH / 2, HEIGHT / 4, `${piece} wins!`, {
//         color: pieceColorsStr[piece],
//         fontFamily: FONTS.AvantGardeGothic,
//         fontSize: FONT_SIZES.Title,
//       })
//       .setShadow(4, 4, "#000000", 8, true, true)
//       .setOrigin(0.5),
//   );

//   uiObjects.add(
//     "play-again-btn",
//     scene.add
//       .text(WIDTH / 2, HEIGHT / 2, "Play Again", {
//         fontFamily: FONTS.AvantGardeGothic,
//         backgroundColor: pieceColorsStr[piece],
//         color: pieceTextColor[piece],
//       })
//       .setPadding({ x: 24, y: 16 })
//       .setOrigin(0.5)
//       .setInteractive()
//       .on("pointerdown", () => {
//         GameMap.clear();
//         clearBoard();
//         uiObjects.destroy("win-title");
//         uiObjects.destroy("play-again-btn");
//       }),
//   );
// };

// export const start = (text: Text) => {
//   uiObjects.add("title", text.title("Connect4", COLORS.white));
//   uiObjects.add(
//     "1p-btn",
//     text
//       .button({
//         x: 100,
//         y: HEIGHT - 100,
//         backgroundColor: COLORS.red,
//         color: COLORS.white,
//         text: "One Player",
//       })
//       .on("pointerdown", () => {
//         // begin(1)
//       }),
//   );
//   uiObjects.add(
//     "2p-btn",
//     text
//       .button({
//         x: WIDTH - 100,
//         y: HEIGHT - 100,
//         backgroundColor: COLORS.red,
//         color: COLORS.white,
//         text: "Two Player",
//       })
//       .on("pointerdown", () => {
//         begin(2);
//       }),
//   );
// };

// export const begin = (players: number) => {
//   let ready = false;
//   uiObjects.destroy("title");
//   uiObjects.destroy("1p-btn");
//   uiObjects.destroy("2p-btn");
//   scene.input.on("pointerdown", (pointer) => {
//     if (!ready) {
//       return;
//     }
//     ready = false;
//     const column = getColumnFromCoord(pointer.x);
//     const row = GameMap.getNextAvailableRowForColumn(column);
//     if (!row) {
//       console.log("No row found");
//       return;
//     }
//     placePiece(piece, column, row).then(() => {
//       GameMap.update(column, row, piece);
//       const winnerSearch = GameMap.search(WINNER, piece);
//       if (winnerSearch.found) {
//         winner(this, piece, winnerSearch.coords);
//       } else {
//         piece = invertPiece(piece);
//         ready = true;
//       }
//     });
//   });
// };
