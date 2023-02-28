export interface IEvent {
  metricType: string;
  name: string;
  description: string;
  eventName?: string;
  matcher?: string;
  url?: string;
  selector?: string;
  winCriteria: string;
  unit?: string;
  eventType: string;
}

export interface IEventAnalysis {
  start: string;
  end: string;
  data: IAnalysisItem;
}

export interface IAnalysisItem {
  [x: string]: IAnalysisData;
}

export interface IDistribution {
  x: number;
  y: number;
}

interface IAnalysisData {
  mean: number;
  winningPercentage: number;
  credibleInterval: {
    lower: number;
    upper: number;
  };
  distributionChart: IDistribution[];
  sampleSize: number;
}

export interface IChartData {
  label: string;
  data: unknown[];
}

export interface ITableData {
  name?: string;
  winningPercentage?: number;
  credibleInterval?: {
    lower: number;
    upper: number;
  };
  mean?: number;
  sampleSize?: number;
}
