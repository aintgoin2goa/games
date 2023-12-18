import { Game } from "./game";
import * as GameMap from "./map";
import {
  MOVE_00XX,
  MOVE_XX00,
  NEXT_MOVE_WIN_0XXX,
  NEXT_MOVE_WIN_X0XX,
  NEXT_MOVE_WIN_XX0X,
  NEXT_MOVE_WIN_XXX0,
  SNEAKY_00XX,
  SNEAKY_XX00,
  getSearchByName,
} from "./search";
import { Coord, Piece } from "./types";
import { coordToColumnRow, invertPiece } from "./utils";

export class Player {
  game: Game;
  piece: Piece;

  constructor(game: Game, piece: Piece) {
    this.game = game;
    this.piece = piece;
  }

  getSuggestedMoves(
    searchResult: GameMap.SearchResult,
    allowedMoves: Coord[],
  ): Coord[] {
    const moves = [];
    for (const [name, coords] of searchResult.results.entries()) {
      coords.forEach((coordList) => {
        const suggested = getSearchByName(name).suggestMove(coordList);
        if (allowedMoves.includes(suggested)) {
          moves.push(suggested);
        }
      });
    }

    return moves;
  }

  calculateBestMove(possibleMoves: Coord[]): Coord | null {
    const theirPossibleWinningMoves = GameMap.search(
      [
        NEXT_MOVE_WIN_0XXX,
        NEXT_MOVE_WIN_X0XX,
        NEXT_MOVE_WIN_XX0X,
        NEXT_MOVE_WIN_XXX0,
      ],
      invertPiece(this.piece),
    );

    const movesToStopThemWinning = this.getSuggestedMoves(
      theirPossibleWinningMoves,
      possibleMoves,
    );
    if (movesToStopThemWinning.length) {
      return movesToStopThemWinning[0];
    }

    const myPossibleWinningMoves = GameMap.search(
      [
        NEXT_MOVE_WIN_0XXX,
        NEXT_MOVE_WIN_X0XX,
        NEXT_MOVE_WIN_XX0X,
        NEXT_MOVE_WIN_XXX0,
      ],
      this.piece,
    );

    const movestoWin = this.getSuggestedMoves(
      myPossibleWinningMoves,
      possibleMoves,
    );
    if (movestoWin.length) {
      return movestoWin[0];
    }

    const otherMoves = this.getSuggestedMoves(
      GameMap.search(
        [SNEAKY_00XX, SNEAKY_XX00, MOVE_00XX, MOVE_XX00],
        this.piece,
      ),
      possibleMoves,
    );

    if (otherMoves.length) {
      return otherMoves[0];
    }

    return null;
  }

  randomMove(possibleMoves: Coord[]): Coord {
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  takeTurn() {
    const possibleMoves = GameMap.getAllPossibleMoves();
    let move = this.calculateBestMove(possibleMoves);
    if (move === null) {
      move = this.randomMove(possibleMoves);
    }

    const { column, row } = coordToColumnRow(move);

    this.game.takeTurn(this.piece, column, row);
  }
}
