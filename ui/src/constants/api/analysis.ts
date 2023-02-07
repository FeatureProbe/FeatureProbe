const origin = '/api';

const AnalysisURL = {
  analysisMetric: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric`,
};

export default AnalysisURL;