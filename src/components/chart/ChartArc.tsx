import React, { useEffect, useRef } from 'react';
import { describeArc } from '../../utils/chart';

interface ChartArcProps {
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  strokeWidth: number;
  color: string;
  background?: boolean;
}

export function ChartArc({
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  strokeWidth,
  color,
  background = false
}: ChartArcProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const initialRender = useRef(true);

  useEffect(() => {
    if (background || !pathRef.current) return;

    // Only animate on initial render
    if (initialRender.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      // Set up the initial state
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = 'none';
      
      // Force a reflow
      path.getBoundingClientRect();
      
      // Start the animation
      path.style.transition = 'stroke-dashoffset 1s ease-in-out';
      path.style.strokeDashoffset = '0';
      
      initialRender.current = false;
    }
  }, [background]);

  return (
    <path
      ref={pathRef}
      d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={background ? 'opacity-20' : ''}
    />
  );
}