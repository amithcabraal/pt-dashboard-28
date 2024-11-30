import React from 'react';
import { PerformanceTest } from '../../types';
import { ChartArc } from './ChartArc';
import { Guideline } from './Guideline';
import { polarToCartesian } from '../../utils/chart';

interface RadialChart2Props {
  tests: PerformanceTest[];
}

const BAR_WIDTH = 25;
const LABEL_SPACING = BAR_WIDTH + 2; // Add small gap between labels

function getProgressColor(percentage: number) {
  if (percentage >= 100) return 'var(--progress-high-bg)';
  if (percentage >= 50) return 'var(--progress-medium-bg)';
  return 'var(--progress-low-bg)';
}

export function RadialChart2({ tests }: RadialChart2Props) {
  if (!tests || tests.length === 0) {
    return null;
  }

  // Calculate degrees per test based on number of items
  // Add 1 to total count to create a small gap at the end
  const DEGREES_PER_TEST = 360 / (tests.length + 1);

  const radius = 200;
  const center = radius + BAR_WIDTH * 2;
  const labelWidth = 450;
  const size = (radius + BAR_WIDTH * 4) * 2 + labelWidth * 2;
  const verticalLineX = center + labelWidth;

  const sortedTests = [...tests].sort((a, b) => a.sequence - b.sequence);

  return (
    <div id="overview-chart-2" className="mt-8 p-4">
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">Test Progress Distribution</h2>
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Guidelines for every test */}
          {sortedTests.map((_, index) => (
            <Guideline
              key={index}
              centerX={verticalLineX}
              centerY={center}
              radius={radius + BAR_WIDTH * 2.5}
              angle={index * DEGREES_PER_TEST}
              color="#C0C0C0"
            />
          ))}

          {/* Static Labels */}
          <g transform={`translate(510 ${2 * LABEL_SPACING})`}>
            <g transform="rotate(0)">
              <text 
                x={radius - 25} 
                y={-LABEL_SPACING * 1.5} 
                textAnchor="end" 
                dominantBaseline="middle" 
                className="text-sm font-medium dark:text-white"
              >
                TPS
              </text>
              <text 
                x={radius - 25} 
                y={-LABEL_SPACING * 0.5} 
                textAnchor="end" 
                dominantBaseline="middle" 
                className="text-sm font-medium dark:text-white"
              >
                Env
              </text>
              <text 
                x={radius - 25} 
                y={LABEL_SPACING * 0.5} 
                textAnchor="end" 
                dominantBaseline="middle" 
                className="text-sm font-medium dark:text-white"
              >
                Script
              </text>
              <text 
                x={radius - 25} 
                y={LABEL_SPACING * 1.5} 
                textAnchor="end" 
                dominantBaseline="middle" 
                className="text-sm font-medium dark:text-white"
              >
                Data
              </text>
            </g>
          </g>

          {/* Background arcs */}
          <ChartArc
            centerX={verticalLineX}
            centerY={center}
            radius={radius - BAR_WIDTH * 1.5}
            startAngle={0}
            endAngle={sortedTests.length * DEGREES_PER_TEST}
            strokeWidth={BAR_WIDTH - 1}
            color="#9ca3af"
            background
          />
          <ChartArc
            centerX={verticalLineX}
            centerY={center}
            radius={radius - BAR_WIDTH * 0.5}
            startAngle={0}
            endAngle={sortedTests.length * DEGREES_PER_TEST}
            strokeWidth={BAR_WIDTH - 1}
            color="#9ca3af"
            background
          />
          <ChartArc
            centerX={verticalLineX}
            centerY={center}
            radius={radius + BAR_WIDTH * 0.5}
            startAngle={0}
            endAngle={sortedTests.length * DEGREES_PER_TEST}
            strokeWidth={BAR_WIDTH - 1}
            color="#9ca3af"
            background
          />
          <ChartArc
            centerX={verticalLineX}
            centerY={center}
            radius={radius + BAR_WIDTH * 1.5}
            startAngle={0}
            endAngle={sortedTests.length * DEGREES_PER_TEST}
            strokeWidth={BAR_WIDTH - 1}
            color="#9ca3af"
            background
          />

          {/* Data arcs and labels for each test */}
          {sortedTests.map((test, index) => {
            const startAngle = index * DEGREES_PER_TEST;
            const midAngle = startAngle + DEGREES_PER_TEST / 2;
            const tpsPercentage = test.execution.targetTps 
              ? (test.execution.achievedTps / test.execution.targetTps) * 100 
              : 0;

            // Calculate label position
            const labelRadius = radius + BAR_WIDTH * 2.5;
            const labelPos = polarToCartesian(verticalLineX, center, labelRadius, midAngle);
            const isRightSide = midAngle <= 180;
            const labelOffset = isRightSide ? 40 : -40;

            return (
              <g key={test.id}>
                {/* Data preparation arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={radius - BAR_WIDTH * 1.5}
                  startAngle={startAngle}
                  endAngle={startAngle + (test.preparation.data * DEGREES_PER_TEST / 100)}
                  strokeWidth={BAR_WIDTH - 1}
                  color={getProgressColor(test.preparation.data)}
                />

                {/* Script development arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={radius - BAR_WIDTH * 0.5}
                  startAngle={startAngle}
                  endAngle={startAngle + (test.preparation.script * DEGREES_PER_TEST / 100)}
                  strokeWidth={BAR_WIDTH - 1}
                  color={getProgressColor(test.preparation.script)}
                />

                {/* Environment setup arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={radius + BAR_WIDTH * 0.5}
                  startAngle={startAngle}
                  endAngle={startAngle + (test.preparation.env * DEGREES_PER_TEST / 100)}
                  strokeWidth={BAR_WIDTH - 1}
                  color={getProgressColor(test.preparation.env)}
                />

                {/* TPS achievement arc */}
                <ChartArc
                  centerX={verticalLineX}
                  centerY={center}
                  radius={radius + BAR_WIDTH * 1.5}
                  startAngle={startAngle}
                  endAngle={startAngle + (Math.min(100, tpsPercentage) * DEGREES_PER_TEST / 100)}
                  strokeWidth={BAR_WIDTH - 1}
                  color={`var(--status-${test.status}-bg)`}
                />

                {/* Test label with connecting line */}
                <line
                  x1={labelPos.x}
                  y1={labelPos.y}
                  x2={isRightSide ? labelPos.x + 20 : labelPos.x - 20}
                  y2={labelPos.y}
                  stroke="currentColor"
                  className="dark:text-white"
                  strokeWidth="1"
                />
                <text
                  x={isRightSide ? labelPos.x + 25 : labelPos.x - 25}
                  y={labelPos.y}
                  textAnchor={isRightSide ? "start" : "end"}
                  dominantBaseline="middle"
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