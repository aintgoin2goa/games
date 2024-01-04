import { Game } from "./game";
import { Searcher, SearchResult } from "./search";
import {
  MOVE_00XX,
  MOVE_XX00,
  NEXT_MOVE_WINS,
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
import { coord2Tuple, coordToColumnRow, invertPiece } from "./utils";
import { debug } from "./debug";

export class Player {
  game: Game;
  piece: Piece;
  searcher: Searcher;
  currentTurn: number;
  debugger: ReturnType<typeof debug>;

  constructor(game: Game, piece: Piece) {
    this.game = game;
    this.piece = piece;
    this.searcher = new Searcher(this.game.map);
    this.currentTurn = 0;
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

  calculateBestMoves(possibleMoves: Coord[]): {
    moves: Coord[];
    check: boolean;
  } {
    let moves = [];
    const myPossibleWinningMoves = this.searcher.search(
      NEXT_MOVE_WINS,
      this.piece,
    );

    const movestoWin = this.getSuggestedMoves(
      myPossibleWinningMoves,
      possibleMoves,
    );
    this.debugger("movesToWin", movestoWin);

    if (movestoWin.length) {
      return { moves: movestoWin, check: false };
    }

    const theirPossibleWinningMoves = this.searcher.search(
      NEXT_MOVE_WINS,
      invertPiece(this.piece),
    );

    const movesToStopThemWinning = this.getSuggestedMoves(
      theirPossibleWinningMoves,
      possibleMoves,
    );
    this.debugger("movesToStopThemWinning", movesToStopThemWinning);

    if (movesToStopThemWinning.length) {
      return { moves: movesToStopThemWinning, check: false };
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
    this.debugger("otherMoves", otherMoves);

    moves = moves.concat(otherMoves);

    return { moves, check: true };
  }

  checkMoves(moves: Coord[]): Coord | null {
    for (const move of moves) {
      const { column, row } = coordToColumnRow(move);
      const map = this.game.map.clone();
      map.update(column, row, this.piece);
      const searcher = new Searcher(map);
      const theirPossibleWinningMoves = searcher.search(
        NEXT_MOVE_WINS,
        invertPiece(this.piece),
      );
      this.debugger("checkMove", { move, theirPossibleWinningMoves });
      if (theirPossibleWinningMoves.results.size === 0) {
        return move;
      }
    }

    return null;
  }

  randomMove(possibleMoves: Coord[]): Coord {
    const preferredColumns = ["D", "E"];
    const preferredRows = ["6"];
    possibleMoves.sort((a, b) => {
      const [aCol, aRow] = coord2Tuple(a);
      const [bCol, bRow] = coord2Tuple(b);
      if (preferredColumns.includes(aCol) && preferredRows.includes(aRow)) {
        return -1;
      }

      if (preferredColumns.includes(bCol) && preferredRows.includes(bRow)) {
        return 1;
      }

      if (preferredColumns.includes(aCol) || preferredRows.includes(aRow)) {
        return -1;
      }

      if (preferredColumns.includes(bCol) || preferredRows.includes(bRow)) {
        return 1;
      }

      return 0;
    });

    return possibleMoves[0];
  }

  takeTurn() {
    this.currentTurn++;
    this.debugger = debug(`AI: turn ${this.currentTurn}`);
    const possibleMoves = this.game.map.getAllPossibleMoves();
    this.debugger("possibleMoves", possibleMoves);
    const { moves, check } = this.calculateBestMoves(possibleMoves);
    let move: Coord | null | undefined = check
      ? this.checkMoves(moves)
      : moves[0];

    if (move === null || move === undefined) {
      move = this.randomMove(possibleMoves);
    }
    this.debugger("bestMoves", { moves, move });

    const { column, row } = coordToColumnRow(move);

    this.debugger("TakeTurn", { column, row });
    this.debugger.end();
    this.game.takeTurn(this.piece, column, row);
  }
}
