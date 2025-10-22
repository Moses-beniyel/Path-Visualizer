// algorithms/dfs.js
export const dfsAlgorithm = (grid, startNode, endNode) => {
  if (!startNode || !endNode) {
    console.error("Start or end node not found");
    return { visitedNodesInOrder: [], path: [] };
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array(rows)
    .fill(false)
    .map(() => Array(cols).fill(false));
  const visitedNodesInOrder = [];

  // Reset previous nodes for path reconstruction
  const gridCopy = grid.map((row) =>
    row.map((node) => ({
      ...node,
      previousNode: null,
    }))
  );

  let found = false;

  const dfsSearch = (row, col) => {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      visited[row][col] ||
      gridCopy[row][col].isWall
    ) {
      return false;
    }

    visited[row][col] = true;
    const currentNode = gridCopy[row][col];
    visitedNodesInOrder.push(currentNode);

    if (row === endNode.row && col === endNode.col) {
      found = true;
      return true;
    }

    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    
    ];

    for (const [dRow, dCol] of directions) {
      const nRow = row + dRow;
      const nCol = col + dCol;

      if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
        if (!visited[nRow][nCol] && !gridCopy[nRow][nCol].isWall) {
          gridCopy[nRow][nCol].previousNode = currentNode;
          if (dfsSearch(nRow, nCol)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  dfsSearch(startNode.row, startNode.col);

  const path = [];
  if (found) {
    let currentNode = gridCopy[endNode.row][endNode.col];
    while (currentNode !== null && currentNode !== startNode) {
      path.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
  }

  console.log("DFS - Visited nodes:", visitedNodesInOrder.length);
  console.log("DFS - Path found:", found);
  let algo = "dfs";

  return { visitedNodesInOrder, path, found, algo };
};
