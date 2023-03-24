import { origin } from './constant';

const AnalysisURL = {
  metric: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric`,
  analysis: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/analysis`,
  iterations: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/iterations`,
  diagnose: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/diagnosis`
};

export default AnalysisURL;
