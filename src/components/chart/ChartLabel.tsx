import React from 'react';
import { createLabelArc } from '../../utils/chart';

interface ChartLabelProps {
  id: string;
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  text: string;
}

export function ChartLabel({
  id,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  text
}: ChartLabelProps) {
  return (
    <>
      <defs>
        <path
          id={id}
          d={createLabelArc(centerX, centerY, radius, startAngle, endAngle)}
        />
      </defs>
      <text className="text-sm font-medium dark:text-white">
        <textPath
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {text}
        </textPath>
      </text>
    </>
  );
}