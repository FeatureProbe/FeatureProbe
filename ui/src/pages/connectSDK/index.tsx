import { useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import ProjectLayout from 'layout/projectLayout';
import Loading from 'components/Loading';
import SelectSDK from './components/SelectSDK';
import SetupCode from './components/SetupCode';
import TestConnection from './components/TestConnection';
import { ToggleReturnType, SdkLanguage, SDK_VERSION } from './constants';
import { saveDictionary, getFromDictionary } from 'services/dictionary';
import { getSdkVersion } from 'services/misc';
import { getToggleAccess, getToggleInfo, getToggleAttributes } from 'services/toggle';
import { getProjectInfo, getEnvironment } from 'services/project';
import { getEventDetail } from 'services/analysis';
import { IDictionary, IToggleInfo } from 'interfaces/targeting';
import { IProject, IEnvironment, IRouterParams } from 'interfaces/project';
import { IEvent } from 'interfaces/analysis';

import styles from './index.module.scss';

interface IStep {
  [x: string]: {
    done: boolean;
    projectKey?: string;
    environmentKey?: string;
    toggleKey?: string;
    sdk?: string;
  };
}

interface IAccess {
  isAccess: boolean;
}

const step: IStep = {
  step1: {
    done: true,
  },
  step2: {
    done: false,
  },
  step3: {
    done: false,
  },
};

const PREFIX = 'get_started_';

const ConnectSDK = () => {
  const [ currentStep, saveCurrentStep ] = useState<number>(2);
  const [ currentSDK, saveCurrentSDK ] = useState<SdkLanguage>('Java');
  const [ serverSdkKey, saveServerSDKKey ] = useState<string>('');
  const [ clientSdkKey, saveClientSdkKey ] = useState<string>('');
  const [ sdkVersion, saveSDKVersion ] = useState<string>('');
  const [ returnType, saveReturnType ] = useState<ToggleReturnType>('');
  const [ toggleAccess, saveToggleAccess ] = useState<boolean>(false);
  const [ projectName, saveProjectName ] = useState<string>('');
  const [ environmentName, saveEnvironmentName ] = useState<string>('');
  const [ toggleName, saveToggleName ] = useState<string>('');
  const [ isLoading, saveIsLoading ] = useState<boolean>(false);
  const [ isInfoLoading, saveIsInfoLoading ] = useState<boolean>(true);
  const [ isStepLoading, saveIsStepLoading ] = useState<boolean>(true);
  const [ clientAvailability, saveClientAvailability ] = useState<boolean>(false);
  const [ attributes, saveAttributes ] = useState<string[]>([]);
  // const [ eventInfo, saveEventInfo ] = useState<IEvent>();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();

  const init = useCallback(async() => {
    const key = PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey;

    Promise.all([
      getFromDictionary<IDictionary>(key), 
      getToggleAttributes<string[]>(projectKey, environmentKey, toggleKey),
      getEventDetail<IEvent>(projectKey, environmentKey, toggleKey)
    ]).then(res => {
      saveIsStepLoading(false);
      if (res[0].success && res[0].data) {
        const savedData = JSON.parse(res[0].data.value);

        if (savedData.step2.done) {
          saveCurrentStep(3);
          saveCurrentSDK(savedData.step1.sdk);
        } else if (savedData.step1.done) {
          saveCurrentStep(2);
          saveCurrentSDK(savedData.step1.sdk);
        }
      } else {
        saveCurrentStep(1);
      }

      if (res[1].success && res[1].data) {
        saveAttributes(res[1].data);
      }

      // if (res[2].success && res[2].data) {
      //   saveEventInfo(res[2].data);
      // }
    });

    Promise.all([
      getProjectInfo<IProject>(projectKey), 
      getEnvironment<IEnvironment>(projectKey, environmentKey), 
      getToggleInfo<IToggleInfo>(projectKey, environmentKey, toggleKey)
    ]).then(res => {
      saveIsInfoLoading(false);
      
      if (res[0].success && res[0].data) {
        saveProjectName(res[0].data.name);
      }

      if (res[1].success &&  res[1].data) {
        saveServerSDKKey(res[1].data.serverSdkKey);
        saveClientSdkKey(res[1].data.clientSdkKey);
        saveEnvironmentName(res[1].data.name);
      }

      if (res[2].success && res[2].data) {
        saveReturnType(res[2].data.returnType as ToggleReturnType);
        saveClientAvailability(res[2].data.clientAvailability);
        saveToggleName(res[2].data.name);
      }
    });
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (currentSDK) {
      const key = SDK_VERSION.get(currentSDK);

      if (key) {
        getSdkVersion<string>(key).then(res => {
          const { success, data } = res;
          if (success && data) {
            saveSDKVersion(data);
          }
        });
      }
    }
  }, [currentSDK]);

  const checkToggleStatus = useCallback(() => {
    getToggleAccess<IAccess>(projectKey, environmentKey, toggleKey).then(res => {
      const { data } = res;
      if (res.success && data) {
        saveToggleAccess(data.isAccess);
      }
    });
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    if (currentStep === 3) {
      checkToggleStatus();
    }
  }, [currentStep, checkToggleStatus]);

  const saveFirstStep = useCallback((sdk: string) => {
    step.step1.done = true;
    step.step1.sdk = sdk;
    saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
      if (res.success) {
        saveCurrentStep(currentStep + 1);
      }
    });
  }, [projectKey, environmentKey, toggleKey, currentStep]);

  const saveSecondStep = useCallback(() => {
    step.step2.done = true;
    saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
      if (res.success) {
        saveCurrentStep(currentStep + 1);
        saveIsLoading(true);
      }
    });
  }, [projectKey, environmentKey, toggleKey, currentStep]);

  const goBackToStep = useCallback((currentStep: number) => {
    saveCurrentStep(currentStep);
    if (currentStep === 1) {
      step.step2.done = false;
    }
  }, []);

  return (
    <ProjectLayout>
      <div className={styles['connect-sdk']}>
        <div className={styles.intro}>
          {
            isInfoLoading ? <Loading /> : (
              <>
                <div className={styles['intro-header']}>
                  <span className={styles['intro-title']}>
                    <FormattedMessage id='common.get.started.text' />
                  </span>
                </div>
                <div className={styles['intro-desc']}>
                  <FormattedMessage id='connect.description' />
                </div>
                <div className={styles['intro-info']}>
                  <div className={styles['card-item']}>
                    <div className={styles['card-title']}>
                      <FormattedMessage id='common.project.text' /> :
                    </div>
                    <div className={styles['card-value']}>
                      { projectName }
                    </div>
                  </div>
                  <div className={styles['card-item']}>
                    <div className={styles['card-title']}>
                      <FormattedMessage id='common.environment.text' /> :
                    </div>
                    <div className={styles['card-value']}>
                      { environmentName }
                    </div>
                  </div>
                  <div className={styles['card-item']}>
                    <div className={styles['card-title']}>
                      <FormattedMessage id='common.toggle.text' /> :
                    </div>
                    <div className={styles['card-value']}>
                      <FormattedMessage id='connect.first.toggle.view.left' />
                      <span className={styles['toggle-name']}>{ toggleName }</span>
                      <FormattedMessage id='connect.first.toggle.view.right' />
                      <span className={styles['toggle-key']}>{ toggleKey }</span>
                    </div>
                  </div>
                </div>
              </>
            )
          }
        </div>
        <div className={styles.steps}>
          {
            isStepLoading ? <Loading /> : (
              <>
                <SelectSDK 
                  currentStep={currentStep}
                  currentSDK={currentSDK}
                  clientAvailability={clientAvailability}
                  saveStep={saveFirstStep}
                  saveCurrentSDK={saveCurrentSDK}
                  goBackToStep={goBackToStep}
                />
                <SetupCode 
                  attributes={attributes}
                  currentStep={currentStep}
                  currentSDK={currentSDK}
                  returnType={returnType}
                  serverSdkKey={serverSdkKey}
                  clientSdkKey={clientSdkKey}
                  sdkVersion={sdkVersion}
                  saveStep={saveSecondStep}
                  goBackToStep={goBackToStep}
                />
                <TestConnection 
                  isLoading={isLoading}
                  projectKey={projectKey}
                  environmentKey={environmentKey}
                  toggleKey={toggleKey}
                  currentStep={currentStep}
                  toggleAccess={toggleAccess}
                  saveIsLoading={saveIsLoading}
                  checkToggleStatus={checkToggleStatus}
                />
              </>
            )
          }
        </div>
      </div>
    </ProjectLayout>
  );
};

export default ConnectSDK;
