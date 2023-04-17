import { origin } from './constant';

const EventTrackURI = {
  eventTrackerStatus: `${origin}/projects/:projectKey/environments/:environmentKey/events/tracker-status`,
  eventStream: `${origin}/projects/:projectKey/environments/:environmentKey/events`,
};

export default EventTrackURI;