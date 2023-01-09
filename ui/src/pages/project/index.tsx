import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Joyride, { CallBackProps, EVENTS, ACTIONS, Step } from 'react-joyride';
import { getProjectList } from 'services/project';
import Button from 'components/Button';
import message from 'components/MessageBox';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import { HeaderContainer } from 'layout/hooks';
import ProjectCard from './components/ProjectCard';
import ProjectDrawer from './components/ProjectDrawer';
import { Provider } from './provider';
import { IProject } from 'interfaces/project';
import { OWNER } from 'constants/auth';
import { getFromDictionary, saveDictionary } from 'services/dictionary';
import EventTracker from 'components/EventTracker';
import { commonConfig, floaterStyle, tourStyle } from 'constants/tourConfig';
import { USER_GUIDE_PROJECT } from 'constants/dictionary_keys';
import { IDictionary } from 'interfaces/targeting';

import styles from './index.module.scss';

const STEPS: Step[] = [
  {
    content: (
      <div>
        <div className="joyride-title">
          <FormattedMessage id="guide.project.step1.title" />
        </div>
        <ul className="joyride-item">
          <li>
            <FormattedMessage id="guide.project.step1.content1" />
          </li>
          <li>
            <FormattedMessage id="guide.project.step1.content2" />
          </li>
        </ul>
        <div className="joyride-pagination">1/2</div>
      </div>
    ),
    spotlightPadding: 10,
    placement: 'right',
    target: '.project-card',
    ...commonConfig,
  },
  {
    content: (
      <div>
        <div className="joyride-title">
          <FormattedMessage id="guide.project.step2.title" />
        </div>
        <ul className="joyride-item">
          <li>
            <FormattedMessage id="guide.project.step2.content1" />
          </li>
        </ul>
        <div className="joyride-pagination">2/2</div>
      </div>
    ),
    spotlightPadding: 10,
    placement: 'right',
    target: '.sdk-key',
    ...commonConfig,
  },
];

const Project = () => {
  const [ projectList, saveProjectList ] = useState<IProject[]>([]);
  const [ isAdd, setIsAdd ] = useState<boolean>(true);
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ projectKey, setProjectKey ] = useState<string>('');
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const [run, saveRun] = useState<boolean>(false);
  const [stepIndex, saveStepIndex] = useState<number>(0);

  const intl = useIntl();
  const { userInfo } = HeaderContainer.useContainer();

  const getUserGuide = useCallback(() => {
    getFromDictionary<IDictionary>(USER_GUIDE_PROJECT).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        if (parseInt(savedData) !== STEPS.length) {
          setTimeout(() => {
            saveRun(true);
          }, 500);
          saveStepIndex(parseInt(savedData));
        }
      } else {
        setTimeout(() => {
          saveRun(true);
        }, 500);
      }
    });
  }, []);

  const init = useCallback(async () => {
    saveIsLoading(true);
    const res = await getProjectList<IProject[]>();
    const { data } = res;
    saveIsLoading(false);
    if (res.success && data) {
      saveProjectList(data);
      if (data.length > 0) {
        getUserGuide();
      }
    } else {
      message.error(res.message || intl.formatMessage({id: 'projects.list.error.text'}));
    }
  }, [getUserGuide, intl]);

  useEffect(() => {
    init();
  }, [init]);

  const handleAddProject = useCallback(() => {
    setIsAdd(true);
    setVisible(true);
  }, []);

  const handleEditProject = useCallback((projectKey: string) => {
    setIsAdd(false);
    setVisible(true);
    setProjectKey(projectKey);
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      saveStepIndex(nextStepIndex);
      saveDictionary(USER_GUIDE_PROJECT, nextStepIndex);
    }
  }, []);

	return (
    <div className={styles.project}>
      <Provider>
        <>
          <div className={styles.header}>
            <div>
              <span className={styles.title}>
                <FormattedMessage id='common.projects.text' />
              </span>
              { projectList.length > 0 && <span className={styles.count}>{projectList.length}</span> }
              <div className={styles['project-desc']}>
                <FormattedMessage id='projects.description' />
              </div>
            </div>
            {
              OWNER.includes(userInfo.role) && (
                <div>
                  <EventTracker category='project' action='create-project'>
                    <Button primary onClick={handleAddProject}>
                      <Icon customclass={styles.iconfont} type='add' />
                      <FormattedMessage id='common.project.text' />
                    </Button>
                  </EventTracker>
                </div>
              )
            }
          </div>
          <div className={styles.content}>
            {
              isLoading ? <Loading style={{background: 'transparent'}} /> : (
                <>
                  {
                    projectList.map((item: IProject) => {
                      return (
                        <ProjectCard
                          key={item.key}
                          project={item}
                          handleEditProject={handleEditProject}
                          refreshProjectsList={init}
                        />
                      );
                    })
                  }
                </>
              )
            }
          </div>
          <ProjectDrawer 
            isAdd={isAdd}
            visible={visible}
            projectKey={projectKey}
            setDrawerVisible={setVisible}
            refreshProjectsList={init}
          />
          <Joyride
            run={run}
            callback={handleJoyrideCallback}
            stepIndex={stepIndex}
            continuous
            hideCloseButton
            scrollToFirstStep
            showProgress={false}
            showSkipButton
            scrollOffset={1000}
            disableCloseOnEsc={true}
            steps={STEPS}
            locale={{
              back: intl.formatMessage({ id: 'guide.last' }),
              next: intl.formatMessage({ id: 'guide.next' }),
              last: intl.formatMessage({ id: 'guide.done' }),
            }}
            floaterProps={{ ...floaterStyle }}
            styles={{ ...tourStyle }}
          />
        </>
      </Provider>
    </div>
	);
};

export default Project;
