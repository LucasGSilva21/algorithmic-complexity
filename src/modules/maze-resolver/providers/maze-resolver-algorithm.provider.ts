import { Injectable } from '@nestjs/common';

@Injectable()
export class MazeResolverAlgorithmProvider {
  handle(input: number[][]) {
    const start = performance.now();

    const matrix = input;

    const startRow = 0;
    const startCol = 0;
    const endRow = matrix.length - 1;
    const endCol = matrix.length - 1;

    const result = this.solveMaze(matrix, startRow, startCol, endRow, endCol);

    const end = performance.now();

    return {
      result,
      totalTimeToProcess: Number(end - start),
    };
  }

  solveMaze(matrix, startRow, startCol, endRow, endCol) {
    // Define an array to keep track of visited cells and paths
    const visited = [];
    const paths = [];

    // Generate rows for the visited and paths arrays
    for (let i = 0; i < matrix.length; i++) {
      visited.push([]);
      paths.push([]);

      // Generate columns for the visited and paths arrays
      for (let j = 0; j < matrix[0].length; j++) {
        visited[i].push(false);
        paths[i].push(null);
      }
    }

    // Define a recursive function to perform the depth-first search
    function dfs(row, col, path) {
      // Check if we've reached the end of the maze
      if (row === endRow && col === endCol) {
        return path;
      }

      // Mark the current cell as visited and set the path
      visited[row][col] = true;
      paths[row][col] = path;

      // Check the adjacent cells
      const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
      ];

      for (let i = 0; i < directions.length; i++) {
        const nextRow = row + directions[i].row;
        const nextCol = col + directions[i].col;

        // Check if the next cell is valid and unvisited
        if (
          nextRow >= 0 &&
          nextRow < matrix.length &&
          nextCol >= 0 &&
          nextCol < matrix[0].length &&
          matrix[nextRow][nextCol] === 0 &&
          !visited[nextRow][nextCol]
        ) {
          // Recursively call dfs on the next cell and update the path
          const nextPath = [...path, { row: nextRow, col: nextCol }];
          const result = dfs(nextRow, nextCol, nextPath);
          if (result) {
            return result;
          }
        }
      }

      // If we've explored all possible paths and haven't found the end, backtrack
      return null;
    }

    // Call dfs on the starting cell and return the path
    const startPath = [{ row: startRow, col: startCol }];
    return dfs(startRow, startCol, startPath);
  }
}
