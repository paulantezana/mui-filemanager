import { useState, useRef } from "react";

export function useResizablePanel(initialLeftWidth = 300, minWidth = 100) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const containerRef = useRef(null);

  const startResizing = (e) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (e) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(minWidth, startWidth + delta);
      setLeftWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return {
    leftWidth,
    containerRef,
    startResizing,
  };
}
