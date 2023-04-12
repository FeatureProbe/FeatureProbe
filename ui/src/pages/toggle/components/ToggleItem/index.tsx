import { SyntheticEvent, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { Table, Popup, PaginationProps } from 'semantic-ui-react';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import message from 'components/MessageBox';
import Button from 'components/Button';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import TextLimit from 'components/TextLimit';
import TagsList from 'components/TagsList';
import { getPrerequisiteDependencies, getToggleInfo, offlineToggle, restoreToggle } from 'services/toggle';
import { IToggle } from 'interfaces/toggle';
import { IToggleInfo, IVariation } from 'interfaces/targeting';
import { variationContainer, toggleInfoContainer } from '../../provider';
import { IPrerequisiteToggle, IPrerequisiteToggleList } from 'interfaces/prerequisite';
import ToggleList from 'pages/targeting/components/PublishModal/ToggleList';
import styles from './index.module.scss';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
}

interface IProps {
  toggle: IToggle
  isArchived?: boolean;
  enableApproval: boolean;
  setDrawerVisible(visible: boolean): void;
  setIsAdd(isAdd: boolean): void;
  refreshToggleList(): void;
}

const ToggleItem = (props: IProps) => {
  const { toggle, isArchived, enableApproval, setDrawerVisible, setIsAdd, refreshToggleList } = props;
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ archiveOpen, setArchiveOpen] = useState<boolean>(false);
  const [ restoreOpen, setRestoreOpen] = useState<boolean>(false);
  const [ canNotDeleteOpen, setCanNotDeleteOpen ] = useState<boolean>(false);
  const [ pagination, setPagination ] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, saveTotal ] = useState<number>(0);
  const [ searchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [ toggles, saveToggles ] = useState<IPrerequisiteToggle[]>([]);

  const history = useHistory();
  const intl = useIntl();
  const { projectKey, environmentKey } = useParams<ILocationParams>();
  const { saveVariations } = variationContainer.useContainer();
  const { saveToggleInfo, saveOriginToggleInfo } = toggleInfoContainer.useContainer();

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const getToggleList = useCallback((toggleKey: string, searchParams: ISearchParams) => {
    getPrerequisiteDependencies<IPrerequisiteToggleList>(projectKey, environmentKey, toggleKey, searchParams).then(res => {
      const { success, data } = res;
      if (success && data) {
        const { content, pageable, totalPages, totalElements } = data;
        saveToggles(content);
        setPagination({
          pageIndex: (pageable?.pageNumber || 0) + 1,
          totalPages: totalPages || 1,
        });
        saveTotal(totalElements || 0);
        if (totalElements > 0) {
          setCanNotDeleteOpen(true);
        } else {
          setArchiveOpen(true);
        }
      } 
    });
  }, [environmentKey, projectKey]);

  const gotoEditing = useCallback((toggleKey: string) => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/targeting`);
  }, [projectKey, environmentKey, history]);

  const handleEditToggle = useCallback((e: SyntheticEvent, toggleKey: string) => {
    e.stopPropagation();

    getToggleInfo<IToggleInfo>(projectKey, environmentKey, toggleKey).then(res => {
      const { data, success } = res;
      if (success && data) {
        const { name, key, returnType, disabledServe, desc, tags, clientAvailability, permanent } = data;
        setDrawerVisible(true);
        setIsAdd(false);

        const cloneVariations = cloneDeep(data.variations) || [];
        cloneVariations.forEach((variation: IVariation) => {
          variation.id = uuidv4();
        });
        saveVariations(cloneVariations);
  
        saveToggleInfo({
          name,
          key,
          returnType,
          disabledServe,
          desc,
          tags,
          clientAvailability,
          permanent,
        });

        saveOriginToggleInfo({
          name,
          key,
          returnType,
          disabledServe,
          desc,
          tags,
          clientAvailability,
          permanent,
        });
      }
    });
  }, [projectKey, environmentKey, saveToggleInfo, saveOriginToggleInfo, saveVariations, setIsAdd, setDrawerVisible]);

  const confirmArchiveToggle = useCallback(async () => {
    const res = await offlineToggle(projectKey, toggle.key);

    if (res.success) {
      message.success(intl.formatMessage({id: 'toggles.archive.success'}));
      refreshToggleList();
    } else {
      message.error(intl.formatMessage({id: 'toggles.archive.error'}));
    }
  }, [toggle.key, projectKey, intl, refreshToggleList]);

  const confirmRestoreToggle = useCallback(async () => {
    const res = await restoreToggle(projectKey, toggle.key);

    if (res.success) {
      message.success(intl.formatMessage({id: 'toggles.restore.success'}));
      refreshToggleList();
    } else {
      message.error(intl.formatMessage({id: 'toggles.restore.error'}));
    }
  }, [toggle.key, projectKey, intl, refreshToggleList]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    getToggleList(toggle.key, {
      ...searchParams,
      pageIndex: Number(data.activePage) - 1,
    });
  }, [getToggleList, searchParams, toggle.key]);

	return (
    <Table.Row
      className={styles['list-item']}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onClick={() => gotoEditing(toggle.key)}
    >
      <Table.Cell>
        <div className={styles['toggle-info']}>
          {
            toggle.locked && (
              <Popup
                inverted
                className='popup-override'
                trigger={
                  <span className={styles['toggle-lock-bg']}>
                    <Icon type='lock' customclass={styles['toggle-lock']}></Icon>
                  </span>
                }
                content={
                  <div>
                    <div className={styles['popup-line']}><FormattedMessage id='common.lock.text' /></div>
                    <div className={styles['popup-line']}><FormattedMessage id='common.lock.by' />: { toggle.lockedBy }</div>
                    <div className={styles['popup-line']}><FormattedMessage id='common.lock.time' />: { dayjs(toggle.lockedTime).format('YYYY-MM-DD HH:mm:ss') }</div>
                  </div>
                }
                position='top center'
              />
            )
          }
          <div className={styles['toggle-info-name']}>
            <TextLimit text={toggle.name} maxWidth={300} />
          </div>
          <div className={styles['toggle-info-key']}>
            <CopyToClipboardPopup text={toggle.key}>
              <div onClick={(e) => {e.stopPropagation();}} className={styles['toggle-info-key-label']}>
                {toggle.key}
              </div>
            </CopyToClipboardPopup>
          </div>
          {
            toggle.useDays && !isArchived && (
              <div className={styles['toggle-permanent-bg']}>
                <Popup
                  inverted
                  className='popup-override'
                  trigger={
                    <span>
                      <Icon type='timeout' />
                    </span>
                  }
                  content={intl.formatMessage({ id: 'toggles.permanent.tips' }, { useDays: toggle.useDays })}
                  position='top center'
                  wide={true}
                />
              </div>
            )
          }
        </div>
        {
          toggle.desc && (
            <div className={styles['toggle-info-description']}>
              {toggle.desc}
            </div>
          )
        }
      </Table.Cell>
      {
        enableApproval && (
          <Table.Cell>
            {
              toggle.releaseStatus === 'PENDING_APPROVAL' && (
                <div className={styles['publish-status-pending-review']}>
                  <span className={`${styles['status-circle']} ${styles['status-circle-pending-review']}`}></span>
                  <span>
                    <FormattedMessage id='approvals.status.pending' />
                  </span>
                </div>
              )
            }
            {
              toggle.releaseStatus === 'PENDING_RELEASE' && (
                <div className={styles['publish-status-pending-publish']}>
                  <span className={`${styles['status-circle']} ${styles['status-circle-pending-publish']}`}></span>
                  <span>
                    <FormattedMessage id='approvals.status.unpublished' />
                  </span>
                </div>
              )
            }
            {
              toggle.releaseStatus === 'REJECT' && (
                <div className={styles['publish-status-declined']}>
                  <span className={`${styles['status-circle']} ${styles['status-circle-declined']}`}></span>
                  <span>
                    <FormattedMessage id='approvals.status.declined' />
                  </span>
                </div>
              )
            }
            {
              toggle.releaseStatus === 'RELEASE' && (
                <div className={styles['publish-status-release']}>
                  <span className={`${styles['status-circle']} ${styles['status-circle-release']}`}></span>
                  <span>
                    <FormattedMessage id='approvals.status.published' />
                  </span>
                </div>
              )
            }
          </Table.Cell>
        )
      }
      <Table.Cell>
        {
          toggle.disabled ? (
            <div className={styles['toggle-status']}>
              <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-disabled']}`}></div>
              <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-disabled']}`}>
                <FormattedMessage id='common.disabled.text' />
              </div>
            </div>
          ) : (
            <div className={styles['toggle-status']}>
              <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-enabled']}`}></div>
              <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-enabled']}`}>
                <FormattedMessage id='common.enabled.text' />
              </div>
            </div>
          ) 
        }
      </Table.Cell>
      <Table.Cell>
        <div>
          {toggle.returnType}
        </div>
      </Table.Cell>
      <Table.Cell>
        {
          toggle.tags && toggle.tags.length > 0 ? (
            <TagsList 
              tags={toggle.tags}
              showCount={2}
            />
          ) : (<>-</>)
        }
      </Table.Cell>
      <Table.Cell>
        {
          toggle.visitedTime ? (
            dayjs(toggle.visitedTime).diff(Date.now(), 'week') > -1 ? (
              <div className={styles['toggle-evaluated']}>
                <div>
                  <FormattedMessage id='toggles.filter.evaluated.last.seven.days' />
                </div>
                <div>
                  <Icon type='evaluate' customclass={styles['icon-evaluate']} />
                  <span>
                    {
                      intl.formatMessage({id: 'toggles.evaluated.text'}, {
                        time: dayjs(toggle?.visitedTime).format('YYYY-MM-DD HH:mm:ss')
                      })
                    }
                  </span>
                </div>
              </div> 
            ) : (
              <div className={styles['toggle-evaluated']}>
                <div>
                  <FormattedMessage id='toggles.filter.evaluated.not.last.seven.days' />
                </div>
                <div>
                  <Icon type='evaluate' customclass={styles['icon-evaluate']} />
                  <span>
                    {
                      intl.formatMessage({id: 'toggles.evaluated.text'}, {
                        time: dayjs(toggle?.visitedTime).format('YYYY-MM-DD HH:mm:ss')
                      })
                    }
                  </span>
                </div>
              </div> 
            )
          ) : (
            <div className={styles['toggle-evaluated']}>
              <div>
                <FormattedMessage id='toggles.evaluated.novisit' /> 
              </div>
              <div className={styles['toggle-evaluated-tips']}>
                <FormattedMessage id='toggles.evaluated.link.sdk' /> 
              </div>
            </div>
          )
        }
      </Table.Cell>
      <Table.Cell>
        {
          visible ? (
            <div className={styles['toggle-operation']}>
              {
                !isArchived && (
                  <div className={styles['toggle-operation-item']} onClick={(e) => {
                    document.body.click();
                    handleEditToggle(e, toggle.key);
                  }}>
                    <FormattedMessage id='common.edit.text' />
                  </div>
                )
              }
              {
                isArchived ? (
                  <div 
                    className={styles['toggle-operation-item']} 
                    onClick={(e) => {
                      document.body.click();
                      e.stopPropagation();
                      setRestoreOpen(true); 
                    }}
                  >
                    <FormattedMessage id='common.restore.text' />
                  </div>
                ) : (
                  <div 
                    className={styles['toggle-operation-item']} 
                    onClick={(e) => { 
                      document.body.click();
                      e.stopPropagation();
                      getToggleList(toggle.key, searchParams);
                    }}
                  >
                    <FormattedMessage id='common.archive.text' />
                  </div>
                )
              }
            </div>
          ) : (
            <div className={styles['toggle-operation']}></div>
          )
        }
      </Table.Cell>
      <Modal 
        open={archiveOpen}
        width={400}
        handleCancel={(e: SyntheticEvent) => {
          e.stopPropagation();
          setArchiveOpen(false);
        }}
        handleConfirm={(e: SyntheticEvent) => {
          e.stopPropagation();
          setArchiveOpen(false);
          confirmArchiveToggle();
        }}
      >
        <div onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
          <div>
            <Icon customclass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='toggles.archive.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='toggles.archive.content' />
          </div>
        </div>
      </Modal>

      <Modal 
        open={restoreOpen}
        width={400}
        handleCancel={(e: SyntheticEvent) => {
          e.stopPropagation();
          setRestoreOpen(false);
        }}
        handleConfirm={(e: SyntheticEvent) => {
          e.stopPropagation();
          setRestoreOpen(false);
          confirmRestoreToggle();
        }}
      >
        <div onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
          <div>
            <Icon customclass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='toggles.restore.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='toggles.restore.content' />
          </div>
        </div>
      </Modal>

      <Modal
        open={canNotDeleteOpen}
        width={600} 
        footer={
          <div className={styles['modal-footer']}>
            <Button
              key="confirm"
              primary
              onClick={async (e: SyntheticEvent) => {
                e.stopPropagation();
                setCanNotDeleteOpen(false);
              }}
            >
              <FormattedMessage id="common.confirm.text" />
            </Button>
          </div>
        }
      >
        <div className={styles['modal-inner-box']}>
          <div className={styles['modal-header']}>
            <span>
              <FormattedMessage id="toggles.archive.disabled.title" />
            </span>
            <Icon
              customclass={styles['modal-header-icon']}
              type="close"
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                setCanNotDeleteOpen(false);
              }}
            />
          </div>
          <div className={styles['prerequisite-modal-content']}>
            <div className={styles['modal-tips']}>
              <Icon type="warning-circle" customclass={styles['modal-info-circle']} />
              {intl.formatMessage({ id: 'toggles.archive.prerequisite.tips'}, { toggle: total })}
            </div>
            <div className={styles['modal-not-delete-content']}>
              <ToggleList 
                total={total}
                pagination={pagination}
                toggleList={toggles}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </Modal>
    </Table.Row>
	);
};

export default ToggleItem;
