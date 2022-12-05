const origin = '/api';

const ProjectURI = {
  addProjectURI: `${origin}/projects`,
  editProjectURI: `${origin}/projects/:projectKey`,
  deleteProjectURI: `${origin}/projects/:projectKey`,
  addEnvironmentURI: `${origin}/projects/:projectKey/environments`,
  editEnvironmentURI: `${origin}/projects/:projectKey/environments/:environmentKey`,
  offlineEnvironmentURI: `${origin}/projects/:projectKey/environments/:environmentKey/offline`,
  restoreEnvironmentURI: `${origin}/projects/:projectKey/environments/:environmentKey/restore`,
  getProjectListURI: `${origin}/projects`,
  getProjectInfoURI: `${origin}/projects/:projectKey`,
  projectExistURI: `${origin}/projects/exists`,
  projectApprovalSetting: `${origin}/projects/:projectKey/approvalSettings`,
  projectSetting: `${origin}/projects/:projectKey/approvalSettings`,
};

export default ProjectURI;