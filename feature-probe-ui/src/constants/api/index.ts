import project from './project';
import toggle from './toggle';
import user from './user';
import member from './member';
import misc from './misc';
import segment from './segment';
import dictionary from './dictionary';
import approvals from './approval';
import webhook from './webhook';
import tokens from './tokens';

const APIS = {
  ...project,
  ...toggle,
  ...user,
  ...member,
  ...segment,
  ...dictionary,
  ...misc,
  ...approvals,
  ...webhook,
  ...tokens,
};

export default APIS;
