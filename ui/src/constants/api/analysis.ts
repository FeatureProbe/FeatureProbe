const origin = '/api';

const AnalysisURL = {
  metric: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric`,
  analysis: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/analysis`
};

export default AnalysisURL;