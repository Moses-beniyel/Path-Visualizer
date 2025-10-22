import React, { useEffect, useState } from "react";
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
  baseSize = 19, // default desktop size
}) => {
  const [size, setSize] = useState(baseSize);

  // Auto adjust node size on window resize (responsive)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) setSize(10);      // small mobile
      else if (width <= 768) setSize(14); // tablet / mid screens
      else if (width <= 1024) setSize(18); // small laptops
      else setSize(baseSize);             // desktop
    };

    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [baseSize]);

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
      className={`node ${extraClass}`}
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
