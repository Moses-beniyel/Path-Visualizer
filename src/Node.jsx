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
  size,
}) => {
  const extraClass = isStart
    ? "node-start"
    : isEnd
    ? "node-end"
    : isWall
    ? "node-wall"
    : isPath
    ? "node-path"
    : isVisited
    ? "node-visited"
    : "";

  return (
    <div
      className={`node
    ${isStart ? "start" : ""}
    ${isEnd ? "end" : ""}
    ${isWall ? "wall" : ""}
    ${isVisited ? "visited" : ""}
    ${isPath ? "path" : ""}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    ></div>
  );
};

export default Node;
