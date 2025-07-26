import { useState, useRef, useEffect } from 'react';

const VerticalSplitter = ({
  leftContent,
  rightContent,
  initialLeftWidth = 50,
  minLeftWidth = 10,
  maxLeftWidth = 90,
  splitterWidth = 4,
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Calcular la nueva posición relativa al contenedor
      const newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;

      // Aplicar límites mínimos y máximos
      const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth));
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const containerStyle = {
    display: 'flex',
    height: '100%',
    width: '100%',
    minHeight: '200px',
    position: 'relative'
  };

  // Overlay invisible para capturar eventos durante el drag
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    cursor: 'col-resize',
    display: isDragging ? 'block' : 'none'
  };

  const leftPanelStyle = {
    width: `${leftWidth}%`,
    overflow: 'auto'
  };

  const splitterStyle = {
    width: `${splitterWidth}px`,
    borderRadius: `${splitterWidth / 2}px`,
    cursor: 'col-resize',
    backgroundColor: isDragging ? '#F84700' : '#e6e6e6ff',
    transition: isDragging ? 'none' : 'background-color 0.2s',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  const splitterHandleStyle = {
    width: '4px',
    height: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '2px'
  };

  const rightPanelStyle = {
    width: `${100 - leftWidth}%`,
    overflow: 'auto'
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
    >
      {/* Overlay invisible para capturar eventos durante el drag */}
      <div style={overlayStyle}></div>

      {/* Panel izquierdo */}
      <div style={leftPanelStyle}>
        {leftContent}
      </div>

      {/* Divisor */}
      <div
        style={splitterStyle}
        onMouseDown={handleMouseDown}
      >
        <div style={splitterHandleStyle}></div>
      </div>

      {/* Panel derecho */}
      <div style={rightPanelStyle}>
        {rightContent}
      </div>
    </div>
  );
};

export default VerticalSplitter;