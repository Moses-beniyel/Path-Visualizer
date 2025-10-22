// algorithms/bfs.js
export const EnhancedbfsAlgorithm = (grid, startNode, endNode) => {
  if (!startNode || !endNode) {
    console.error("Start or end node not found");
    return { visitedNodesInOrder: [], shortestPath: [] };
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array(rows)
    .fill(false)
    .map(() => Array(cols).fill(false));
  const queue = [];
  const visitedNodesInOrder = [];

  // Reset previous nodes for path reconstruction
  const gridCopy = grid.map((row) =>
    row.map((node) => ({
      ...node,
      previousNode: null,
    }))
  );

  queue.push([startNode.row, startNode.col]);
  visited[startNode.row][startNode.col] = true;

  const dRow = [-1, 0, 1, 0, 1, 1, -1, -1];
  const dCol = [0, 1, 0, -1 , 1, -1, 1, -1];

  let found = false;

  while (queue.length > 0 && !found) {
    const [curRow, curCol] = queue.shift();
    const currentNode = gridCopy[curRow][curCol];

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      found = true;
      break;
    }

    for (let i = 0; i < 8; i++) {
      const nRow = curRow + dRow[i];
      const nCol = curCol + dCol[i];

      if (
        nRow >= 0 &&
        nRow < rows &&
        nCol >= 0 &&
        nCol < cols &&
        !visited[nRow][nCol] &&
        !gridCopy[nRow][nCol].isWall
      ) {
        queue.push([nRow, nCol]);
        visited[nRow][nCol] = true;
        gridCopy[nRow][nCol].previousNode = currentNode;
      }
    }
  }

  const shortestPath = [];
  if (found) {
    let currentNode = gridCopy[endNode.row][endNode.col];
    while (currentNode !== null && currentNode !== startNode) {
      shortestPath.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
  }

  console.log("BFS - Visited nodes:", visitedNodesInOrder.length);
  console.log("BFS - Shortest path:", shortestPath.length);
  let algo = "enhancedBfs";
  return { visitedNodesInOrder, shortestPath, algo };
};
