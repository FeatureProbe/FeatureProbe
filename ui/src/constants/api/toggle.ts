import { origin } from './constant';

const ToggleURI = {
  getToggleListURI: `${origin}/projects/:projectKey/toggles`,
  getToggleInfoURI: `${origin}/projects/:projectKey/toggles/:toggleKey`,
  environmentURI: `${origin}/projects/:projectKey/environments`,
  targetingURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting`,
  approvalTargetingURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/approval`,
  targetingDiffURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/diff`,
  createToggleURI: `${origin}/projects/:projectKey/toggles`,
  editToggleURI: `${origin}/projects/:projectKey/toggles/:toggleKey`,
  offlineToggleURI: `${origin}/projects/:projectKey/toggles/:toggleKey/offline`,
  restoreToggleURI: `${origin}/projects/:projectKey/toggles/:toggleKey/restore`,
  tagsURI: `${origin}/projects/:projectKey/tags`,
  trafficURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/traffic`,
  toggleAccessURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/access`,
  toggleTrackEventURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metric/status`,
  toggleExistURI: `${origin}/projects/:projectKey/toggles/exists`,
  environmentExistURI: `${origin}/projects/:projectKey/environments/exists`,
  targetingVersionsURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/versions`,
  targetingVersionsByVersionURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/versions/:version`,
  getAttributesURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/attributes`,
  getPrerequisiteToggleURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/prerequisite/toggles`,
};

export default ToggleURI;
