import React from 'react';
import { createGuideline } from '../../utils/chart';

interface GuidelineProps {
  centerX: number;
  centerY: number;
  radius: number;
  angle: number;
  color?: string;
}

export function Guideline({
  centerX,
  centerY,
  radius,
  angle,
  color = '#C0C0C0'
}: GuidelineProps) {
  return (
    <path
      d={createGuideline(centerX, centerY, radius, angle)}
      stroke={color}
      strokeWidth="1"
      strokeDasharray="4 4"
    />
  );
}