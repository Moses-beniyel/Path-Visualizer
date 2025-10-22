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
  size = 19,
}) => {
  // 🔹 Responsive node size adjustment
  let responsiveSize = size;

  if (window.innerWidth <= 480) {
    responsiveSize = 12; // small phones
  } else if (window.innerWidth <= 768) {
    responsiveSize = 16; // medium phones
  } else if (window.innerWidth <= 1024) {
    responsiveSize = 20; // tablets
  }

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
        width: `${responsiveSize}px`,
        height: `${responsiveSize}px`,
      }}
    />
  );
};

export default Node;
