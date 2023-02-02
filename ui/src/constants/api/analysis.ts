const origin = '/api';

const AnalysisURL = {
  analysisEvent: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/events`,
};

export default AnalysisURL;