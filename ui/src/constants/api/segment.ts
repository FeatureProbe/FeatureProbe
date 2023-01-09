const origin = '/api';

const SegmentURI = {
  segmentURI: `${origin}/projects/:projectKey/segments`,
  segmentExistURI: `${origin}/projects/:projectKey/segments/exists`,
  getSegmentURI: `${origin}/projects/:projectKey/segments/:segmentKey`,
  getSegmentToggleURI: `${origin}/projects/:projectKey/segments/:segmentKey/toggles`,
  getSegmentVersionsURI: `${origin}/projects/:projectKey/segments/:segmentKey/versions`,
  publishSegmentURI: `${origin}/projects/:projectKey/segments/:segmentKey/publish`,
};

export default SegmentURI;