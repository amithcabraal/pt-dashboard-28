import React from 'react';

interface ProgressBarProps {
  value: number;
  label: string;
  isCompact?: boolean;
}

export function ProgressBar({ value, label, isCompact }: ProgressBarProps) {
  const getProgressClass = (percentage: number) => {
    if (percentage >= 100) return 'progress-high';
    if (percentage >= 50) return 'progress-medium';
    return 'progress-low';
  };

  return (
    <div className="border border-gray-300 rounded overflow-hidden h-full">
      <div className="relative h-full flex items-center">
        <div
          className={`absolute inset-0 ${getProgressClass(value)} transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium whitespace-nowrap px-1 flex items-center h-full`}>
            {label}: {value}%
          </span>
        </div>
      </div>
    </div>
  );
}