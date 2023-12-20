import { COLUMN_MAP, DIAG_DOWN_MAP, DIAG_UP_MAP, ROW_MAP } from "./constants";
import { GameMap } from "./map";
import { Coord, MaybePiece, Piece, SearchFunction } from "./types";

export interface SearchResult {
  results: SearchCollectionResult;
}

type Pattern = [MaybePiece, MaybePiece, MaybePiece, MaybePiece];
type Patterns = Map<string, Pattern>;
type CoordList = [Coord, Coord, Coord, Coord];
type SearchLineResult = Map<string, CoordList>;
type SearchCollectionResult = Map<string, CoordList[]>;

export class Searcher {
  private map: GameMap;

  constructor(map: GameMap) {
    this.map = map;
  }

  searchLine(line: Coord[], patterns: Patterns): SearchLineResult {
    let searches: Map<string, string> = new Map();
    for (const [name, pattern] of patterns.entries()) {
      searches.set(name, JSON.stringify(pattern));
    }

    let index = 0;
    let endIndex = 4;
    const result = new Map();
    while (endIndex <= line.length) {
      const coords = line.slice(index, endIndex);
      const pieces = this.map.getCellCollection(coords);
      const searchPieces = JSON.stringify(pieces);
      for (const [name, pattern] of searches.entries()) {
        if (pattern === searchPieces) {
          result.set(name, coords);
        }
      }
      index++;
      endIndex++;
    }

    return result;
  }

  mergeResults(...results: SearchCollectionResult[]): SearchCollectionResult {
    const merged: SearchCollectionResult = new Map();
    for (const result of results) {
      for (const [name, coords] of result.entries()) {
        if (!merged.has(name)) {
          merged.set(name, coords);
        } else {
          const current = merged.get(name);
          current.concat(coords);
          merged.set(name, current);
        }
      }
    }

    return merged;
  }

  searchCollection(
    collection: Coord[][],
    patterns: Patterns,
  ): SearchCollectionResult {
    let found: SearchCollectionResult = new Map();
    for (const line of collection) {
      const lineResult = this.searchLine(line, patterns);
      for (const [name, coords] of lineResult.entries()) {
        const existing = found.has(name) ? found.get(name) : [];
        existing.push(coords);
        found.set(name, existing);
      }
    }
    return found;
  }

  doSearch(patterns: Patterns): SearchCollectionResult {
    return this.mergeResults(
      this.searchCollection(DIAG_DOWN_MAP, patterns),
      this.searchCollection(DIAG_UP_MAP, patterns),
      this.searchCollection(COLUMN_MAP, patterns),
      this.searchCollection(ROW_MAP, patterns),
    );
  }

  search(funcs: SearchFunction[], piece: Piece): SearchResult {
    const patterns: Patterns = new Map();
    for (const func of funcs) {
      patterns.set(func.name, func.getPattern(piece));
    }
    const results = this.doSearch(patterns);
    return {
      results,
    };
  }
}
