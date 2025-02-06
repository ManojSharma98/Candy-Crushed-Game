export const checkForMatches = async (grid: any[][]) => {
  const matches: {row: number; col: number}[] = [];

  // check horizontal matches ( 3 or more in a row)
  for (let r = 0; r < grid.length; r++) {
    let matchesLength = 1;
    for (let c = 0; c < grid[r].length - 1; c++) {
      if (grid[r][c] !== null && grid[r][c] === grid[r][c + 1]) {
        matchesLength++;
      } else {
        if (matchesLength >= 3) {
          for (let i = 0; i < matchesLength; i++) {
            matches.push({row: r, col: c - i});
          }
        }
        matchesLength = 1;
      }
    }
    if (matchesLength >= 3) {
      for (let i = 0; i < matchesLength; i++) {
        matches.push({row: r, col: grid[r].length - 1 - i});
      }
    }
  }
  // check vertical matches ( 3 or more in a column)

  for (let c = 0; c < grid[0].length; c++) {
    let matchesLength = 1;
    for (let r = 0; r < grid.length - 1; r++) {
      if (grid[r][c] !== null && grid[r][c] === grid[r + 1][c]) {
        matchesLength++;
      } else {
        if (matchesLength >= 3) {
          for (let i = 0; i < matchesLength; i++) {
            matches.push({row: r - i, col: c});
          }
        }
        matchesLength = 1;
      }
    }
    if (matchesLength >= 3) {
      for (let i = 0; i < matchesLength; i++) {
        matches.push({row: grid.length - 1 - i, col: c});
      }
    }
  }
  return matches;
};

export const clearMatches = async (
  grid: any[][],
  matches: {row: number; col: number}[],
) => {
  matches?.forEach(match => {
    grid[match.row][match.col] = 0;
  });
  return grid;
};

export const shiftDown = async (grid: any[][]) => {
  for (let col = 0; col < grid[0].length; col++) {
    let emptyRow = grid?.length - 1;
    for (let row = grid?.length - 1; row >= 0; row--) {
      if (grid[row][col] !== null && grid[row][col] !== 0) {
        if (emptyRow !== row) {
          grid[emptyRow][col] = grid[row][col];
          grid[row][col] = 0;
        }
        emptyRow--;
      } else if (grid[row][col] === null) {
        // skip null value to shift down
        emptyRow = row - 1;
      }
    }
  }
  return grid;
};

export const fillRandomCandies = async (grid: any[][]) => {
  const candyType = [1, 2, 3, 4, 5];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) {
        const randomCandy =
          candyType[Math.floor(Math.random() * candyType.length)];
        grid[r][c] = randomCandy;
      }
    }
  }
  return grid;
};

export const hasPossibleMoves = async (grid: any[][]): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;

  const swap = (r1: number, c1: number, r2: number, c2: number) => {
    const temp = grid[r1][c1];
    grid[r1][c1] = grid[r2][c2];
    grid[r2][c2] = temp;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === null) continue;

      // check horizontal swap
      if (c + 1 < cols && grid[r][c + 1] !== null) {
        swap(r, c, r, c + 1);
        // check for one possible move
        if ((await checkForMatches(grid)).length > 0) {
          swap(r, c, r, c + 1);
          return true;
        }
        swap(r, c, r, c + 1);
      }
      // check vertically swap
      if (r + 1 < rows && grid[r + 1][c] !== null) {
        swap(r, c, r + 1, c);
        // check for one possible move
        if ((await checkForMatches(grid)).length > 0) {
          swap(r, c, r + 1, c);
          return true;
        }
        swap(r, c, r + 1, c);
      }
    }
  }

  console.log('no possible found');
  return false;
};

export const shuffleGrid = async (grid: any[][]) => {
  console.log('Shuffling Grid...');

  const candies = grid.flat().filter(cell => cell !== null);
  const rows = grid.length;
  const cols = grid[0].length;

  for (let i = candies.length - 1; i > 0; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [candies[i], candies[j]] = [candies[j], candies[i]];
  }
  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== null) {
        grid[r][c] = candies[index++];
      }
    }
  }
  return grid;
};

export const handleShuffleAndClear = async (grid: any[][]) => {
  console.log('HAndling shuffle and clear ....');
  let newGrid = await shuffleGrid(grid);
  let totalClearedCandies = 0;
  let matches = await checkForMatches(newGrid);
  while (matches?.length > 0) {
    totalClearedCandies += matches.length;
    newGrid = await clearMatches(newGrid, matches);
    newGrid = await shiftDown(newGrid);
    newGrid = await fillRandomCandies(newGrid);

    matches = await checkForMatches(newGrid);
  }

  return {grid: newGrid, clearedMatching: totalClearedCandies};
};
