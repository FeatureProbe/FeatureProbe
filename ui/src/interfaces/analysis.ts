export interface IEvent {
  type: string;
  metricName: string;
  description: string;
  name?: string;
  matcher?: string;
  url?: string;
  selector?: string;
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
}
