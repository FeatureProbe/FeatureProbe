import { useCallback, useEffect, useState, SyntheticEvent } from 'react';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Button';
import message from 'components/MessageBox';
import TextLimit from 'components/TextLimit';
import Loading from 'components/Loading';
import { HeaderContainer } from 'layout/hooks';
import EnvironmentCard from '../EnvironmentCard';
import EnvironmentModal from '../EnvironmentModal';
import { projectContainer } from '../../provider';
import { IArchivedParams, IEnvironment, IProject } from 'interfaces/project';
import { IToggleList } from 'interfaces/toggle';
import { getEnvironmentList, deleteProject } from 'services/project';
import { getToggleList } from 'services/toggle';
import { OWNER } from 'constants/auth';
import styles from './index.module.scss';

interface IProps {
  project: IProject;
  handleEditProject(projectKey: string): void;
  refreshProjectsList(): void;
}

const ProjectCard = (props: IProps) => {
  const { project, handleEditProject, refreshProjectsList } = props;
  const [ modalOpen, setModalOpen ] = useState<boolean>(false);
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  const [ isAddEnvironment, setIsAddEnvironment ] = useState<boolean>(true);
  const [ deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [ cannotDeleteOpen, setCannotDeleteOpen] = useState<boolean>(false);
  const [ isArchived, setIsArchived ] = useState<boolean>(false);
  const [ environments, saveEnvironments ] = useState<IEnvironment[]>(project.environments);
  const [ isLoading, saveIsLoading ] = useState<boolean>(false);

  const intl = useIntl();
  const { userInfo } = HeaderContainer.useContainer();
  const {
    saveProjectInfo,
    saveOriginProjectInfo,
  } = projectContainer.useContainer();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // @ts-ignore null compatibility
      if (e.target?.id === `${project.key}-icon-more`) {
        return;
      } else {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [project.key]);

  useEffect(() => {
    saveEnvironments(project.environments);
  }, [project.environments]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    refreshProjectsList();
    setModalOpen(false);
  }, [refreshProjectsList]);

  const handleAddEnvironment = useCallback(() => {
    setModalOpen(true);
    setIsAddEnvironment(true);
  }, []);

  const handleEditEnvironment = useCallback(() => {
    setModalOpen(true);
    setIsAddEnvironment(false);
  }, []);

  const refreshEnvironmentList = useCallback(async (archived: boolean) => {
    saveIsLoading(true);
    const params: IArchivedParams = {};
    if (archived) {
      params.archived = archived;
    }

    const res = await getEnvironmentList<IEnvironment[]>(project.key, params);
    saveIsLoading(false);
    if (res.success && res.data) {
      saveEnvironments(res.data);
    }
  }, [project]);

  const checkProjectDeletable = useCallback(() => {
    getToggleList<IToggleList>(project.key, {pageIndex: 0, pageSize: 10,})
    .then(async (res) => {
      const { success, data } = res;
      if (success && data) {
        if (data.content.length > 0) {
          setCannotDeleteOpen(true);
        } else {
          setDeleteOpen(true);
        }
      } else {
        setCannotDeleteOpen(true);
      }
    });
  }, [project.key]);

  const confirmDeleteProject = useCallback(async () => {
    const res = await deleteProject(project.key);

    if (res.success) {
      message.success(intl.formatMessage({id: 'projects.delete.success'}));
      refreshProjectsList();
    } else {
      message.error(intl.formatMessage({id: 'projects.delete.error'}));
    }
  }, [project.key, intl, refreshProjectsList]);

	return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.name}>
            <TextLimit text={project.name} maxWidth={194} />
          </div>
          {
            OWNER.includes(userInfo.role) && (
              <>
                <div className={styles['project-edit']} onClick={() => {
                  saveProjectInfo({
                    name: project.name,
                    key: project.key,
                    description: project.description,
                  });
                  saveOriginProjectInfo({
                    name: project.name,
                    key: project.key,
                    description: project.description,
                  });
                  handleEditProject(project.key);
                }}>
                  <Icon customclass={styles['iconfont']} type="edit" />
                </div>
                <Popup
                  basic
                  open={menuOpen}
                  on='click'
                  position='bottom left'
                  className={styles.popup}
                  trigger={
                    <div onClick={() => {
                      setMenuOpen(true);
                    }}>
                      <Icon id={`${project.key}-icon-more`} customclass={styles['iconfont']} type='more' />
                    </div>
                  }
                >
                  <div className={styles['menu']} onClick={() => {setMenuOpen(false);}}>
                    <div className={styles['menu-item']} onClick={handleAddEnvironment}>
                      <FormattedMessage id='projects.menu.add.environment' />
                    </div>
                    {
                      isArchived ? (
                        <div 
                          className={styles['menu-item']} 
                          onClick={() => {
                            setIsArchived(false);
                            refreshEnvironmentList(false);
                          }}
                        >
                          <FormattedMessage id='projects.menu.view.active.environment' />
                        </div>
                      ) : (
                        <div 
                          className={styles['menu-item']} 
                          onClick={() => {
                            setIsArchived(true);
                            refreshEnvironmentList(true);
                          }}
                        >
                          <FormattedMessage id='projects.menu.view.archive.environment' />
                        </div>
                      )
                    }
                    <div className={styles['menu-item']} onClick={() => { checkProjectDeletable(); }}>
                      <FormattedMessage id='projects.menu.delete.project' />
                    </div>
                  </div>
                </Popup>
              </>
            )
          }
        </div>
        <div className={styles.desc}>
          { project.description }
        </div>
      </div>
      {
        isLoading ? <Loading style={{background: 'transparent'}} /> : (
          <div className={styles.content}>
            {
              environments.length > 0 && environments.map((env: IEnvironment, index: number) => {
                return (
                  <EnvironmentCard
                    key={env.key}
                    index={index}
                    item={env}
                    projectKey={project.key}
                    total={environments.length}
                    isArchived={isArchived}
                    handleEditEnvironment={handleEditEnvironment}
                    refreshEnvironmentList={refreshEnvironmentList}
                  />
                );
              })
            }
            {
              !isArchived && OWNER.includes(userInfo.role) && (
                <div className={styles['add-environment']} onClick={handleAddEnvironment}>
                  <Icon customclass={styles['add-environment-icon']} type='add' />
                  <FormattedMessage id='projects.menu.add.environment' />
                </div>
              )
            }
            {
              environments.length === 0 && (
                <div className={styles['no-data']}>
                  <img className={styles['no-data-img']} src={require('images/no-data-available.png')} alt='no-data' />
                  <div className={styles['no-data-text']}>
                    <FormattedMessage id='targeting.metrics.no.data.text' />
                  </div>
                </div>
              )
            }
          </div>
        )
      }
      <EnvironmentModal
        open={modalOpen}
        isAdd={isAddEnvironment}
        projectKey={project.key}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />
      <Modal 
        open={deleteOpen}
        width={400}
        handleCancel={(e: SyntheticEvent) => {
          e.stopPropagation();
          setDeleteOpen(false);
        }}
        handleConfirm={(e: SyntheticEvent) => {
          e.stopPropagation();
          setDeleteOpen(false);
          confirmDeleteProject();
        }}
      >
        <div onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
          <div className={styles['modal-header']}>
            <Icon customclass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='projects.delete.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='projects.delete.content' />
          </div>
        </div>
      </Modal>

      <Modal 
        open={cannotDeleteOpen}
        width={400}
        footer={null}
      >
        <div onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
          <div className={styles['modal-header']}>
            <Icon customclass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='projects.cannot.delete.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='projects.cannot.delete.content' />
          </div>
          <div className={styles.footer}>
            <Button size='mini' className={styles['btn']} primary onClick={ () => {setCannotDeleteOpen(false);} }>
              <FormattedMessage id='common.confirm.text' />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default ProjectCard;
