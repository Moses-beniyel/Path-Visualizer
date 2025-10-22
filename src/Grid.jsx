import React, { useEffect, useRef } from "react";
import Node from "./Node";
import "./grid.css";
import { useState } from "react";
import { bfsAlgorithm } from "./algorithms/bfs";
import { dfsAlgorithm } from "./algorithms/dfs";
import { EnhancedbfsAlgorithm } from "./algorithms/EnhancedBfs";

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [isPausedState, setisPauseState] = useState(false);
  const [nodeType, setNodeType] = useState("wall");
  const isPaused = useRef(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [currentAlgo, setCurrentAlgo] = useState("");

  const toggleNode = (grid, row, col) => {
    const newGrid = grid.map((r) => r.map((c) => ({ ...c }))); // Deep Copy

    if (nodeType === "wall") {
      // Toggle wall
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
    } else if (nodeType === "start") {
      const previousStart = newGrid.flat().find((node) => node.isStart);
      if (previousStart) {
        previousStart.isStart = false;
      }

      newGrid[row][col].isStart = true;
      newGrid[row][col].isWall = false;
    } else if (nodeType === "end") {
      const previousEnd = newGrid.flat().find((node) => node.isEnd);
      if (previousEnd) {
        previousEnd.isEnd = false;
      }

      newGrid[row][col].isEnd = true;
      newGrid[row][col].isWall = false;
    }

    return newGrid;
  };
  //for handling the speed
  const handleSpeed = (event) => {
    let s = 300 - Number(event.target.value);
    setSpeed(s);
  };
  //to pause the search
  const handleStop = () => {
    isPaused.current = !isPaused.current;
    setisPauseState(isPaused.current);
  };
  // when mosue enter in a node
  const handleMouseDown = (row, col) => {
    const newGrid = toggleNode(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isVisualizing) return;
    const newGrid = toggleNode(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => setMouseIsPressed(false);

  useEffect(() => {
    const initialGrid = createGrid();
    setGrid(initialGrid);
  }, []);
  //used to find wheather mouse pressed or not in a all state
  useEffect(() => {
    const handleMouseUpGlobal = () => setMouseIsPressed(false);
    const handleMouseDownGlobal = () => setMouseIsPressed(true);

    document.addEventListener("mouseup", handleMouseUpGlobal);
    document.addEventListener("mousedown", handleMouseDownGlobal);

    return () => {
      document.removeEventListener("mouseup", handleMouseUpGlobal);
      document.removeEventListener("mousedown", handleMouseDownGlobal);
    };
  }, []);
  //create a grid
  const createGrid = () => {
    const rows = [];
    let gridSize = 450; // px
    const rowSize = 20;
    const colSize = 25;
    let Nodesize = gridSize / colSize;
    for (let row = 0; row < rowSize; row++) {
      const currentRows = [];
      for (let col = 0; col < colSize; col++) {
        const node = {
          row,
          col,
          isStart: row === 5 && col === 5,
          isEnd: row === 11 && col === 11,
          isWall: false,
          isVisited: false,
          isPath: false,
          previousNode: null,
          size: Nodesize,
        };
        currentRows.push(node);
      }
      rows.push(currentRows);
    }
    return rows;
  };
  //this function is to create a grid with random walls
  function createGridWithObstacles(rows, cols, wallProbability = 0.5) {
    // Recursive function to create a row
    function createRow(rowIndex, colIndex = 0, row = []) {
      if (colIndex === cols) return row; // Finished current row

      // Randomly decide if this node is a wall
      const isWall = Math.random() < wallProbability;

      row.push({
        row: rowIndex,
        col: colIndex,
        isStart: false,
        isEnd: false,
        isWall: isWall,
        isVisited: false,
        isPath: false,
        previousNode: null,
      });

      return createRow(rowIndex, colIndex + 1, row); // Next column
    }

    // Recursive function to create all rows
    function createAllRows(rowIndex = 0, matrix = []) {
      if (rowIndex === rows) return matrix; // Finished all rows
      const newRow = createRow(rowIndex);
      matrix.push(newRow);
      return createAllRows(rowIndex + 1, matrix); // Next row
    }

    return createAllRows();
  }

  const handleRandomGrid = () => {
    const newGrid = createGridWithObstacles(20, 25, 0.3);
    setGrid(newGrid);
  };
  // Example usage

  // Reset grid visualization (keep walls, start, and end)
  const resetGridVisualization = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); //time out function
  //used to animate the algorithm
  const animateAlgorithm = async (
    visitedNodesInOrder,
    shortestPath = [],
    algo
  ) => {
    setIsVisualizing(true);

    resetGridVisualization();

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      while (isPaused.current) {
        await sleep(100); // check every 100ms if unpaused
      }
      const node = visitedNodesInOrder[i];
      let level = 0;
      if (algo === "dfs") {
        //it is for dfs for good animation
        await sleep(speed);
      } else if (algo === "enhancedBfs" && i % 8 === 0) {
        //for enhanced bfs for good animation
        await sleep(speed);

        console.log("moses");
      } else if (algo === "Bfs" && i % 4 === 0) {
        // this is for bfs for only 4 direction
        await sleep(speed);
      }

      if (node.isStart || node.isEnd) continue;

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
        newGrid[node.row][node.col].isVisited = true;
        return newGrid;
      });
    }

    if (shortestPath && shortestPath.length > 0) {
      for (let i = 0; i < shortestPath.length; i++) {
        const node = shortestPath[i];

        if (node.isStart || node.isEnd) continue;

        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
          newGrid[node.row][node.col].isPath = true;
          return newGrid;
        });

        await sleep(speed);
      }
    }

    setIsVisualizing(false);
  };

  const handleBFS = async () => {
    const startNode = grid.flat().find((n) => n.isStart);
    const endNode = grid.flat().find((n) => n.isEnd);

    if (!startNode || !endNode) {
      console.error("Start or end node not found");
      alert("Please set both start and end nodes before visualizing!");
      return;
    }

    const { visitedNodesInOrder, shortestPath, algo } = bfsAlgorithm(
      grid,
      startNode,
      endNode
    );
    await animateAlgorithm(visitedNodesInOrder, shortestPath, algo);
  };
  const handleEnhancedBfs = async () => {
    const startNode = grid.flat().find((n) => n.isStart);
    const endNode = grid.flat().find((n) => n.isEnd);

    if (!startNode || !endNode) {
      console.error("Start or end node not found");
      alert("Please set both start and end nodes before visualizing!");
      return;
    }

    const { visitedNodesInOrder, shortestPath, algo } = EnhancedbfsAlgorithm(
      grid,
      startNode,
      endNode
    );
    await animateAlgorithm(visitedNodesInOrder, shortestPath, algo);
  };

  const handleDFS = async () => {
    const startNode = grid.flat().find((n) => n.isStart);
    const endNode = grid.flat().find((n) => n.isEnd);

    if (!startNode || !endNode) {
      console.error("Start or end node not found");
      alert("Please set both start and end nodes before visualizing!");
      return;
    }

    const { visitedNodesInOrder, path, algo } = dfsAlgorithm(
      grid,
      startNode,
      endNode
    );

    await animateAlgorithm(visitedNodesInOrder, path, algo);
  };

  const clearPath = () => {
    resetGridVisualization();
  };

  const clearWalls = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
        isVisited: false,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
  };

  const resetStartEnd = () => {
    const newGrid = createGrid(); // Reset to default start/end positions
    setGrid(newGrid);
  };

  return (
    <div className="grid">
      <p>
        Select node type and click on the grid to place walls, start, or end
        nodes
      </p>
      <div className="node-type-selector">
        <label>Node Type: </label>
        <button
          className="wall"
          onClick={() => setNodeType("wall")}
          disabled={isVisualizing}
        >
          Wall
        </button>
        <button
          className="start"
          onClick={() => setNodeType("start")}
          disabled={isVisualizing}
        >
          Source
        </button>
        <button
          className="end"
          onClick={() => setNodeType("end")}
          disabled={isVisualizing}
        >
          Destination
        </button>
      </div>
      <div className="controls">
        {/* Algorithm Controls */}
        <button onClick={handleBFS} disabled={isVisualizing}>
          Start BFS
        </button>
        <button onClick={handleDFS} disabled={isVisualizing}>
          Start DFS
        </button>
        <button onClick={handleEnhancedBfs} disabled={isVisualizing}>Enhanced BFS</button>

        {/* Speed Control */}
        
      </div>
      <div className="grid-container">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((node, nodeIdx) => {
              const {
                row,
                col,
                isStart,
                isEnd,
                isWall,
                isVisited,
                isPath,
                size,
              } = node;
              return (
                <Node
                  key={nodeIdx}
                  row={row}
                  col={col}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
                  isVisited={isVisited}
                  isPath={isPath}
                  size={size}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="feauters">
        <button onClick={clearPath} disabled={isVisualizing}>
          Clear Path
        </button>
        <button onClick={clearWalls} disabled={isVisualizing}>
          Clear Walls
        </button>
        <button onClick={resetStartEnd} disabled={isVisualizing}>
          Reset Start/End
        </button>
        <button onClick={handleRandomGrid}>Random Walls</button>
        <div className="speed-control">
          <input
            type="range"
            min="10"
            max="300"
            value={300 - speed}
            onChange={(e) => handleSpeed(e)}
            disabled={isVisualizing}
          />
          <label>Speed: {300 - speed}ms</label>
        </div>

        <button onClick={handleStop} disabled={!isVisualizing}>
          {isPausedState ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
};

export default Grid;
