// Node.jsx
import React from "react";
import "./node.css";

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  size = 22,
}) => {
  // Use simple, consistent class names: node, start, end, wall, visited, path
  const classNames = [
    "node",
    isStart ? "start" : "",
    isEnd ? "end" : "",
    isWall ? "wall" : "",
    isVisited ? "visited" : "",
    isPath ? "path" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default Node;


