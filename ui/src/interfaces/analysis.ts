export interface IEvent {
  type: string;
  name?: string;
  matcher?: string;
  url?: string;
  selector?: string;
}