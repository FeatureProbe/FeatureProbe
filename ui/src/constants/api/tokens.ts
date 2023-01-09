const origin = '/api';

const TokensURL = {
  createTokenURI: `${origin}/tokens`,
  getTokenListURI: `${origin}/tokens`,
  getTokenURI: `${origin}/tokens/:id}`,
  deleteTokenURI: `${origin}/tokens/:id`,
  checkExistURI: `${origin}/tokens/exists`
};

export default TokensURL;