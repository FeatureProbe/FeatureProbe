export interface IEvent {
  kind: string;
  name: string;
  sdkType: string;
  sdkVersion: string;
  time: number;
  user: string;
  key?: string;
  reason?: string;
  value?: string;
  toggleKey?: string;
  startDate?: string;
  endDate?: string;
  version?: string;
  valueIndex?: number;
  userKey?: string;
  userDetail?: string;
}

export interface IEventStream {
  debuggerEnabled: boolean;
  debugUntilTime: number;
  events: IEvent[];
}
