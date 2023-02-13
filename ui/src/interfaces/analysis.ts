export interface IEvent {
  type: string;
  name?: string;
  matcher?: string;
  url?: string;
  selector?: string;
}

export interface IEventAnalysis {
  [x: string]: unknown;
}