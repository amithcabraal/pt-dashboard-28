export interface TestRun {
  id: string;
  startTime: string;
  endTime: string;
  notes: string;
  appDynamicsUrl: string;
  loadRunnerUrl: string;
}

export interface PerformanceTest {
  id: string;
  reference: string;
  name: string;
  note?: string;
  sequence: number;
  preparation: {
    data: number;
    script: number;
    env: number;
  };
  execution: {
    targetTps: number;
    achievedTps: number;
  };
  status: 'red' | 'amber' | 'green' | 'neutral';
  testRuns: TestRun[];
  lastUpdated?: string;
}

export interface DashboardState {
  tests: PerformanceTest[];
  lastUpdated: string | null;
}