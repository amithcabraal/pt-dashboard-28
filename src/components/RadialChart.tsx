import React from 'react';
import { PerformanceTest } from '../types';
import { ChartArc } from './chart/ChartArc';
import { ChartLabel } from './chart/ChartLabel';
import { Guideline } from './chart/Guideline';

interface RadialChartProps {
  tests: PerformanceTest[];
}

const statusColors = {
  red: 'var(--status-red-bg)',
  amber: 'var(--status-amber-bg)',
  green: 'var(--status-green-bg)',
  neutral: 'var(--status-neutral-bg)',
};

function getProgressColor(percentage: number) {
  if (percentage >= 100) return 'var(--progress-high-bg)';
  if (percentage >= 50) return 'var(--progress-medium-bg)';
  return 'var(--progress-low-bg)';
}

export function RadialChart({ tests }: RadialChartProps) {
  if (!tests || tests.length === 0) {
    return null;
  }

  const radius = 225;
  const strokeWidth = 18; // Reduced stroke width to allow for gaps
  const labelWidth = 350;
  const center = radius + strokeWidth * 2;
  const size = (radius + strokeWidth * 4) * 2 + labelWidth;
  const verticalLineX = center + labelWidth;
  
  const minRadius = strokeWidth * 2;
  const availableSpace = radius - minRadius;
  const spacingBetweenArcs = availableSpace / (tests.length - 1 || 1);

  const sortedTests = [...tests].sort((a, b) => a.sequence - b.sequence);

  return (
    <div id="overview-chart" className="mt-8 p-4">
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">Test Completion Overview</h2>
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Guidelines */}
          {[0, 15, 30, 45].map(angle => (
            <Guideline
              key={angle}
              centerX={verticalLineX}
              centerY={center}
              radius={radius + strokeWidth * 1.2}
              angle={angle}
              color="#C0C0C0"
            />
          ))}

          {/* Labels */}
          <ChartLabel
            id="data-label"
            centerX={verticalLineX}
            centerY={center}
            radius={radius + strokeWidth * 1.1}
            startAngle={2}
            endAngle={13}
            text="Data"
          />
          <ChartLabel
            id="script-label"
            centerX={verticalLineX}
            centerY={center}
            radius={radius + strokeWidth * 1.1}
            startAngle={17}
            endAngle={28}
            text="Script"
          />
          <ChartLabel
            id="env-label"
            centerX={verticalLineX}
            centerY={center}
            radius={radius + strokeWidth * 1.1}
            startAngle={32}
            endAngle={43}
            text="Env"
          />
          <ChartLabel
            id="tps-label"
            centerX={verticalLineX}
            centerY={center}
            radius={radius + strokeWidth * 1.1}
            startAngle={47}
            endAngle={90}
            text="TPS Percentage Achieved"
          />

          {sortedTests.map((test, index) => {
            const currentRadius = radius - (index * spacingBetweenArcs);
            const tpsPercentage = test.execution.targetTps 
              ? (test.execution.achievedTps / test.execution.targetTps) * 100 
              : 0;

            return (
              <g key={test.id}>
                {/* Background circle */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={currentRadius}
                  startAngle={0}
                  endAngle={270}
                  strokeWidth={strokeWidth - 1}
                  color="#9ca3af"
                  background
                />
                
                {/* Data arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={currentRadius}
                  startAngle={0}
                  endAngle={test.preparation.data * 15 / 100}
                  strokeWidth={strokeWidth - 1}
                  color={getProgressColor(test.preparation.data)}
                />
                
                {/* Script arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={currentRadius}
                  startAngle={15}
                  endAngle={15 + (test.preparation.script * 15 / 100)}
                  strokeWidth={strokeWidth - 1}
                  color={getProgressColor(test.preparation.script)}
                />
                
                {/* Env arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={currentRadius}
                  startAngle={30}
                  endAngle={30 + (test.preparation.env * 15 / 100)}
                  strokeWidth={strokeWidth - 1}
                  color={getProgressColor(test.preparation.env)}
                />
                
                {/* TPS arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={currentRadius}
                  startAngle={45}
                  endAngle={45 + (Math.min(100, tpsPercentage) * 225 / 100)}
                  strokeWidth={strokeWidth - 1}
                  color={statusColors[test.status]}
                />

                {/* Test label */}
                <text
                  x={verticalLineX - 10}
                  y={center - currentRadius}
                  textAnchor="end"
                  dominantBaseline="bottom"
                  fill="currentColor"
                  className="text-sm font-medium dark:text-white"
                >
                  {`${test.reference} - ${test.name}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}