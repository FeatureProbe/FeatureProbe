const origin = '/api';

const AnalysisURL = {
  metric: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric`,
  analysis: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/analysis`,
  iterations: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/iterations`
};

export default AnalysisURL;