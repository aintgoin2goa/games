import { Game } from "./game";
import { Searcher, SearchResult } from "./search";
import {
  MOVE_00XX,
  MOVE_XX00,
  NEXT_MOVE_WIN_0XXX,
  NEXT_MOVE_WIN_X0XX,
  NEXT_MOVE_WIN_XX0X,
  NEXT_MOVE_WIN_XXX0,
  SINGLE_000X,
  SINGLE_00X0,
  SINGLE_0X00,
  SINGLE_X000,
  SNEAKY_00XX,
  SNEAKY_XX00,
  getSearchByName,
} from "./searches";
import { Coord, Piece } from "./types";
import { coordToColumnRow, invertPiece } from "./utils";

export class Player {
  game: Game;
  piece: Piece;
  searcher: Searcher;

  constructor(game: Game, piece: Piece) {
    this.game = game;
    this.piece = piece;
    this.searcher = new Searcher(this.game.map);
  }

  getSuggestedMoves(
    searchResult: SearchResult,
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
    const myPossibleWinningMoves = this.searcher.search(
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

    const theirPossibleWinningMoves = this.searcher.search(
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

    const otherMoves = this.getSuggestedMoves(
      this.searcher.search(
        [
          SNEAKY_00XX,
          SNEAKY_XX00,
          MOVE_00XX,
          MOVE_XX00,
          SINGLE_000X,
          SINGLE_00X0,
          SINGLE_0X00,
          SINGLE_X000,
        ],
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
    const possibleMoves = this.game.map.getAllPossibleMoves();
    let move = this.calculateBestMove(possibleMoves);
    if (move === null) {
      move = this.randomMove(possibleMoves);
    }

    const { column, row } = coordToColumnRow(move);

    this.game.takeTurn(this.piece, column, row);
  }
}
