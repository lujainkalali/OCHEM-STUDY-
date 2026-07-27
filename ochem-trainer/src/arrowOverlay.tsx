import React, { useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Arrow {
  start: Point;
  end: Point;
}

export function ArrowOverlay({ isActive }: { isActive: boolean }) {
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [currentArrow, setCurrentArrow] = useState<Arrow | null>(null);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const start = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCurrentArrow({ start, end: start });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!currentArrow) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCurrentArrow({
      ...currentArrow,
      end: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    });
  };

  const handleMouseUp = () => {
    if (currentArrow) {
      setArrows([...arrows, currentArrow]);
      setCurrentArrow(null);
    }
  };

  // Helper to calculate the curve's control point (bends the arrow upward/sideways)
  const renderCurvedArrow = (start: Point, end: Point, key: number | string) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    // Offset control point to create the curve
    const controlX = midX - (end.y - start.y) * 0.3;
    const controlY = midY + (end.x - start.x) * 0.3;

    return (
      <g key={key}>
        {/* Curved Path */}
        <path
          d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
          fill="none"
          stroke="#aa3bff"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
      </g>
    );
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isActive ? 'all' : 'none', // Turn on when user clicks "Draw Arrow"
        cursor: isActive ? 'crosshair' : 'default'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* SVG Arrowhead Marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#aa3bff" />
        </marker>
      </defs>

      {/* Render saved arrows */}
      {arrows.map((arr, index) => renderCurvedArrow(arr.start, arr.end, index))}

      {/* Render arrow currently being drawn */}
      {currentArrow && renderCurvedArrow(currentArrow.start, currentArrow.end, 'active')}
    </svg>
  );
}