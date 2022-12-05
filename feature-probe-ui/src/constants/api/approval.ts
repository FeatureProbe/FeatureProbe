const origin = '/api';

const ApprovalURI = {
  approvalRecords: `${origin}/approvalRecords`,
  approvalTotal: `${origin}/approvalRecords/total`,
  approvalStatus: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/approvalStatus`,
  publishTargetingSketch: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/sketch/publish`,
  cancelTargetingSketch: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/sketch/cancel`,
};

export default ApprovalURI;