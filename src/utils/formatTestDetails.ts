import { PerformanceTest, TestRun } from '../types';

export function formatTestDetails(test: PerformanceTest): string {
  const sections = [
    `${test.reference} - ${test.name}`,
    '\nPreparation Status:',
    `• Data: ${test.preparation.data}%`,
    `• Script: ${test.preparation.script}%`,
    `• Environment: ${test.preparation.env}%`,
    '\nExecution Metrics:',
    `• Target TPS: ${test.execution.targetTps}`,
    `• Achieved TPS: ${test.execution.achievedTps}`,
    `• Achievement Rate: ${(test.execution.achievedTps / test.execution.targetTps * 100).toFixed(1)}%`,
    '\nStatus:',
    `• Current Status: ${test.status.toUpperCase()}`
  ];

  if (test.note) {
    sections.push('\nNotes:', test.note);
  }

  if (test.testRuns.length > 0) {
    sections.push('\nTest Runs:');
    test.testRuns.forEach((run: TestRun, index: number) => {
      sections.push(
        `\nRun #${index + 1}:`,
        `• Start: ${new Date(run.startTime).toLocaleString()}`,
        `• End: ${new Date(run.endTime).toLocaleString()}`,
        `• AppDynamics: ${run.appDynamicsUrl}`,
        `• LoadRunner: ${run.loadRunnerUrl}`
      );
      if (run.notes) {
        sections.push(`• Notes: ${run.notes}`);
      }
    });
  }

  return sections.join('\n');
}

export function getStatusColor(status: string): string {
  const colors = {
    red: '#DC2626',
    amber: '#D97706',
    green: '#059669',
    neutral: '#6B7280'
  };
  return colors[status] || colors.neutral;
}