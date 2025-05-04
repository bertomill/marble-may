'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

interface SketchCanvasProps {
  lines: any[];
  onLinesChange: (lines: any[]) => void;
}

export default function SketchCanvas({ lines, onLinesChange }: SketchCanvasProps) {
  const [currentLine, setCurrentLine] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const [stageSize, setStageSize] = useState({ width: 500, height: 500 });
  
  useEffect(() => {
    // Set initial size
    updateStageSize();
    
    // Update size on window resize
    const handleResize = () => {
      updateStageSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const updateStageSize = () => {
    // Calculate width based on container size (approximately half the screen width on desktop)
    const width = window.innerWidth < 768 
      ? window.innerWidth - 40 // Full width minus padding on mobile
      : Math.max(400, window.innerWidth / 2 - 50); // Half width minus padding on desktop
    
    setStageSize({
      width,
      height: 500
    });
  };
  
  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine([pos.x, pos.y]);
  };
  
  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setCurrentLine(currentLine => [...currentLine, point.x, point.y]);
  };
  
  const handleMouseUp = () => {
    isDrawing.current = false;
    
    if (currentLine.length < 4) {
      // Line with only one point is not valid, skip it
      setCurrentLine([]);
      return;
    }
    
    onLinesChange([...lines, currentLine]);
    setCurrentLine([]);
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e: any) => {
    e.evt.preventDefault();
    handleMouseDown(e);
  };
  
  const handleTouchMove = (e: any) => {
    e.evt.preventDefault();
    handleMouseMove(e);
  };
  
  const handleTouchEnd = (e: any) => {
    e.evt.preventDefault();
    handleMouseUp();
  };
  
  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="bg-white"
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line}
            stroke="#000000"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        
        {currentLine.length > 0 && (
          <Line
            points={currentLine}
            stroke="#000000"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </Layer>
    </Stage>
  );
} 