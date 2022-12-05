import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import EventTracker from 'components/EventTracker';
import styles from './index.module.scss';

const Project = () => {
  const [ projectList, saveProjectList ] = useState<IProject[]>([]);
  const [ isAdd, setIsAdd ] = useState<boolean>(true);
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ projectKey, setProjectKey ] = useState<string>('');
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const intl = useIntl();
  const { userInfo } = HeaderContainer.useContainer();

  const init = useCallback(async () => {
    saveIsLoading(true);
    const res = await getProjectList<IProject[]>();
    const { data } = res;
    saveIsLoading(false);
    if (res.success && data) {
      saveProjectList(data);
    } else {
      message.error(res.message || intl.formatMessage({id: 'projects.list.error.text'}));
    }
  }, [intl]);

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
        </>
      </Provider>
    </div>
	);
};

export default Project;
