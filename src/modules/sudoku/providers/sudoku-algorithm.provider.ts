import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class SudokuAlgorithmProvider {
  private grid: number[][];
  private iterations = 0;

  get sudoku() {
    return this.grid;
  }

  get neededIterations() {
    return this.iterations;
  }

  /**
   * Finds the first empty cell in this.grid and returns its coordinations in an
   * array where the first entry represents the row (x) and the second entry the
   * column (y).
   */
  findEmptyCell(): [number, number] {
    const coords: [number, number] = [-1, -1];
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (this.grid[x][y] === 0) {
          coords[0] = x;
          coords[1] = y;
          return coords;
        }
      }
    }
    return coords;
  }

  /**
   * Checks if a number is allowed to be used in a given row.
   */
  usedInRow(row, number): boolean {
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === number) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a number is allowed in a given column.
   */
  usedInColumn(column, number): boolean {
    for (let y = 0; y < 9; y++) {
      if (this.grid[y][column] === number) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a number is allowed in a given square.
   */
  usedInSquare(row, column, number): boolean {
    row -= row % 3;
    column -= column % 3;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.grid[x + row][y + column] === number) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if a given number can be placed in a row/column.
   */
  isLocationSafe(row, column, number): boolean {
    return (
      !this.usedInColumn(column, number) &&
      !this.usedInRow(row, number) &&
      !this.usedInSquare(row, column, number)
    );
  }

  /**
   * Recursively solves the sudoku. Returns the solved sudoku grid
   * if possible, or false if there is no solution possible.
   *
   * Use `<number[][]>sudoku` to cast the output of this
   * method after you have made sure it is an array.
   */
  solve(): boolean | number[][] {
    this.iterations++;

    // Find the next empty cell
    const [row, column] = this.findEmptyCell();
    // If no empty cell was found then the sudoku has been solved
    if (row === -1 && column === -1) {
      return true;
    }

    // Try numbers from 1 to 9
    for (let number = 1; number <= 9; number++) {
      // Make sure the location is safe for the current number
      if (this.isLocationSafe(row, column, number)) {
        // Seems good! Store the number in the grid
        this.grid[row][column] = number;

        // Recursively try the next cell with numbers from 1 to 9
        // If it returns true, the sudoku has been solved
        if (this.solve()) {
          return this.grid;
        }

        // Looks like we were wrong, revert back and try again
        this.grid[row][column] = 0;
      }
    }

    return false;
  }

  handle(input: number[][]) {
    this.grid = _.cloneDeep(input);
    let result = {};

    const start = performance.now();

    const solvedSudoku = this.solve();
    if (solvedSudoku) {
      result = solvedSudoku;
    }

    const end = performance.now();

    return {
      result,
      totalTimeToProcess: Number(end - start),
    };
  }
}
