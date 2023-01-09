import { getProjectList } from 'services/project';
import { IProject, IEnvironment } from 'interfaces/project';
import { IDictionary } from 'interfaces/targeting';
import { getFromDictionary } from 'services/dictionary';
import { LAST_SEEN } from 'constants/dictionary_keys';

const getInfo = async () => {
  const res =  await getFromDictionary<IDictionary>(LAST_SEEN);
  const { success, data } = res;
  if (success && data) {
    return JSON.parse(data.value);
  } else {
    return {};
  }
};

export const getRedirectUrl = async (defaultRedirectUrl: string) => {
  let redirectUrl = defaultRedirectUrl;
  const info = await getInfo();
  const { projectKey, environmentKey } = info;

  if (!!projectKey && !!environmentKey) {
    redirectUrl = `/${projectKey}/${environmentKey}/toggles`;
  } else {
    const res = await getProjectList<IProject[]>();
    const { success, data } = res;
    if (success && data) {
      if (data[0]) {
        const { key, environments } = data[0];
        let envKey = '';
        environments.some((environment: IEnvironment) => {
          if (environment.key) {
            envKey = environment.key;
            return true;
          }
          return environment;
        });
  
        if (key && envKey) {
          redirectUrl = `/${key}/${envKey}/toggles`;
        }
      } else {
        redirectUrl = '/projects';
      }
    }
  }

  return redirectUrl;
};