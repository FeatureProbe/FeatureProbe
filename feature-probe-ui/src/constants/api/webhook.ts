const origin = '/api';

const WebHookURI = {
  getWebHookListURI: `${origin}/webhooks`,
  createWebHookURI: `${origin}/webhooks`,
  queryWebHookURI: `${origin}/webhooks/:id`,
  deleteWebHookURI: `${origin}/webhooks/:id`,
  updateWebHookURI: `${origin}/webhooks/:id`,
};

export default WebHookURI;
