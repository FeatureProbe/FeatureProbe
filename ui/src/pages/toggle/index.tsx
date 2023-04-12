import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { 
  Table, 
  Form, 
  Popup,
  PaginationProps, 
  Dropdown, 
  DropdownItemProps, 
  DropdownProps, 
  InputOnChangeData,
  Checkbox,
  CheckboxProps,
} from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { cloneDeep } from 'lodash';
import ToggleItem from './components/ToggleItem';
import ToggleDrawer from './components/ToggleDrawer';
import ProjectLayout from 'layout/projectLayout';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import EventTracker from 'components/EventTracker';
import Pagination from 'components/Pagination';
import NoData from 'components/NoData';
import Loading from 'components/Loading';
import Filter from 'components/Filter';
import { I18NContainer } from 'hooks';
import { getToggleList, getTags } from 'services/toggle';
import { getEnvironment } from 'services/project';
import { saveDictionary } from 'services/dictionary';
import { Provider } from './provider';
import { IToggle, IToggleList,  } from 'interfaces/toggle';
import { IEnvironment, ITag, ITagOption } from 'interfaces/project';
import { NOT_FOUND } from 'constants/httpCode';
import { LAST_SEEN } from 'constants/dictionaryKeys';
import { evaluationOptions, permanentOptions, statusOptions } from './options';

import styles from './index.module.scss';

interface IParams {
  projectKey: string;
  environmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  environmentKey: string;
  visitFilter?: string;
  disabled?: boolean;
  tags?: string[];
  keyword?: string;
  archived?: boolean;
  releaseStatusList?: string[];
  permanent?: boolean;
  related?: boolean;
}

const Toggle = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { projectKey, environmentKey } = useParams<IParams>();
  const [ toggleList, setToggleList ] = useState<IToggle[]>([]);
  const [ pagination, setPagination ] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ visible, setDrawerVisible ] = useState<boolean>(false);
  const [ isAdd, setIsAdd ] = useState<boolean>(false);
  const [ total, setTotal ] = useState<number>(0);
  const [ tagOptions, setTagsOptions ] = useState<ITagOption[]>([]);
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: Number(search.get('pageIndex')) ?? 0,
    pageSize: 10,
    environmentKey,
    visitFilter: search.get('visitFilter') ?? '',
    archived: search.get('archived') === 'true',
    disabled: search.get('disabled') ? search.get('disabled') === 'true' : undefined,
    permanent: search.get('permanent') ? search.get('permanent') === 'true' : undefined,
    keyword: search.get('keyword') ?? '',
    related: search.get('related') ? search.get('related') === 'true' : undefined,
    tags: search.get('tags') ? search.get('tags')?.split(',') : undefined,
  });

  const [ archiveOpen, setArchiveOpen ] = useState<boolean>(false);
  const [ isArchived, setArchived ] = useState<boolean>(search.get('archived') === 'true');
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const [ popupOpen, savePopupOpen ] = useState<boolean>(false);
  const [ releaseStatusList, saveReleaseStatusList ] = useState<string[]>([]);
  const [ enableApproval, saveEnableApproval ] = useState<boolean>(false);
  const history = useHistory();
  const intl = useIntl();
  const { i18n } = I18NContainer.useContainer();

  useEffect(() => {
    const handler = () => {
      if (archiveOpen) {
        setArchiveOpen(false);
      }
      if (popupOpen) {
        savePopupOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [archiveOpen, popupOpen]);

  const getToggleLists = useCallback(() => {
    searchParams.environmentKey = environmentKey;
    saveIsLoading(true);
    getToggleList<IToggleList>(projectKey, searchParams)
      .then(async (res) => {
        const { success, data, code } = res;
        saveIsLoading(false);
        if (success && data) {
          const { content, pageable, totalPages, totalElements } = data;
          setToggleList(content);
          setPagination({
            pageIndex: (pageable?.pageNumber || 0) + 1,
            totalPages: totalPages || 1,
          });
          setTotal(totalElements || 0);
          return;
        } else if (!success && code === NOT_FOUND) {
          saveDictionary(LAST_SEEN, {});
          history.push('/notfound');
          return;
        } else {
          if (res.success)
          setToggleList([]);
          setPagination({
            pageIndex: 1,
            totalPages: 1,
          });

          message.error(intl.formatMessage({id: 'toggles.list.error.text'}));
        }
      });
  }, [intl, projectKey, environmentKey, history, searchParams]);

  const getEnvironmentInfo = useCallback(async() => {
    const res = await getEnvironment<IEnvironment>(projectKey, environmentKey);

    if (res.success && res.data) {
      saveEnableApproval(res.data.enableApproval || false);
    }
  }, [projectKey, environmentKey]);

  useEffect(() => {
    getToggleLists();
    getEnvironmentInfo();
  }, [getToggleLists, getEnvironmentInfo]);

  const getTagList = useCallback(async () => {
    const res = await getTags<ITag[]>(projectKey);
    const { success, data } = res;
    if (success && data) {
      const tags = data.map((item: ITag) => {
        return {
          key: item.name,
          text: item.name,
          value: item.name,
        };
      });

      setTagsOptions(tags);
    } else {
      message.error(intl.formatMessage({id: 'tags.list.error'}));
    }
  }, [intl, projectKey]);

  useEffect(() => {
    getTagList();
  }, [getTagList]);

  useEffect(() => {
    if (projectKey && environmentKey) {
      saveDictionary(LAST_SEEN, {
        projectKey,
        environmentKey,
      });
    }
  }, [projectKey, environmentKey]);

  const handleAddToggle = useCallback(() => {
    setDrawerVisible(true);
    setIsAdd(true);
  }, []);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customclass={styles['dropdown-remove-icon']} type='close' />,
    });
  }, []);

  const pushToHistory = useCallback((key: string, value: string) => {
    const existSearchParams = new URLSearchParams(location.search);
    if (value !== '') {
      existSearchParams.set(key, value);
    } else {
      existSearchParams.delete(key);
    }
    history.push({ search: existSearchParams.toString() });
  }, [history, location.search]);

  // Change evaluated
  const handleEvaluationChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      visitFilter: data.value as string
    });
    pushToHistory('visitFilter', data.value as string);
  }, [pushToHistory, searchParams]);

  // Change status
  const handleStatusChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      disabled: data.value as boolean
    });
    pushToHistory('disabled', data.value as string);
  }, [pushToHistory, searchParams]);

  // Change permanent
  const handlePermanentChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      permanent: data.value as boolean
    });
    pushToHistory('permanent', data.value as string);
  }, [pushToHistory, searchParams]);

  // Change pageIndex
  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1
    });
    pushToHistory('pageIndex', (Number(data.activePage) - 1) > 0 ? (Number(data.activePage) - 1).toString() : '');
  }, [pushToHistory, searchParams]);

  // Change tags
  const handleTagsChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      tags: data.value as string[]
    });
    pushToHistory('tags', (data.value as string[]).join(','));
  }, [pushToHistory, searchParams]);

  // Change keyword
  const handleSearch = useCallback((e: SyntheticEvent, data: InputOnChangeData) => {
    setSearchParams({
      ...searchParams,
      keyword: data.value as string
    });
    pushToHistory('keyword', data.value.toString());
  }, [pushToHistory, searchParams]);

  // Change archived toggles
  const handleSearchArchivedList = useCallback((archived: boolean) => {
    setSearchParams({
      ...searchParams,
      pageIndex: 0,
      archived,
    });
    pushToHistory('archived', archived ? 'true' : '');
  }, [pushToHistory, searchParams]);

  // Change publishing status
  const handleChange = useCallback((status) => {
    if (releaseStatusList.includes(status)) {
      const index = releaseStatusList.indexOf(status);
      releaseStatusList.splice(index, 1);
    }
    else {
      releaseStatusList.push(status);
    }
    saveReleaseStatusList(cloneDeep(releaseStatusList));
  }, [releaseStatusList, saveReleaseStatusList]);

  // Change related to me
  const handleRelated = useCallback((detail: CheckboxProps) => {
    setSearchParams((param) => {
      return {
        ...param,
        related: detail.checked ?? false
      };
    });
    pushToHistory('related', detail.checked ? 'true' : '');
  }, [pushToHistory]);

  const refreshToggleList = useCallback(() => {
    setSearchParams({
      ...searchParams,
      pageIndex: 0,
    });
  }, [searchParams]);

	return (
    <ProjectLayout>
      <div className={styles.toggle}>
        {
          isArchived && (
            <div className={styles.archive}>
              <img 
                alt='archived' 
                className={styles['archived-img']} 
                src={ 
                  i18n === 'en-US' 
                    ? require('images/archived-en.png') 
                    : require('images/archived-zh.png')
                } 
              />
            </div>
          )
        }
        <Provider>
          <>
            <div className={styles.card}>
              {
                isArchived ? (
                  <div className={styles['heading-archive']}>
                    <Icon 
                      type='back' 
                      customclass={styles['icon-back']} 
                      onClick={() => { 
                        setArchived(false); 
                        handleSearchArchivedList(false);
                      }} 
                    />
                    <span className={styles.divider}></span>
                    <FormattedMessage id='common.archived.toggles.text' />
                  </div>
                ) : (
                  <div className={styles.heading}>
                    <FormattedMessage id='common.toggles.text' />
                  </div>
                )
              }
              <div className={styles.tips}>
                <FormattedMessage id='toggles.description' />

                <div className={styles.btn}>
                  {
                    !isArchived && (
                      <EventTracker category='toggle' action='create-toggle'>
                        <Button primary className={styles['add-button']} onClick={handleAddToggle}>
                          <Icon customclass={styles['iconfont']} type='add' />
                          <FormattedMessage id='common.toggle.text' />
                        </Button>
                      </EventTracker>
                    )
                  }
                  <Popup
                    basic
                    open={archiveOpen}
                    on='click'
                    position='bottom right'
                    className={styles.popup}
                    trigger={
                      <div 
                        onClick={(e: SyntheticEvent) => {
                          document.body.click();
                          e.stopPropagation();
                          setArchiveOpen(true);
                        }}
                        className={styles['toggle-menu']}
                      >
                        <Icon customclass={styles['menu-angle-down']} type='angle-down' />
                      </div>
                    }
                  >
                    <div className={styles['menu']} onClick={() => {
                      setArchiveOpen(false);
                    }}>
                      {
                        isArchived ? (
                          <div className={styles['menu-item']} onClick={() => { 
                            document.body.click();
                            setArchived(false); 
                            handleSearchArchivedList(false);
                          }}>
                            <FormattedMessage id='toggles.menu.view.active.toggle' />
                          </div>
                        ) : (
                          <div className={styles['menu-item']} onClick={() => { 
                            document.body.click();
                            setArchived(true); 
                            handleSearchArchivedList(true);
                          }}>
                            <FormattedMessage id='toggles.menu.view.archive.toggle' />
                          </div>
                        )
                      }
                    </div>
                  </Popup>
                </div>
              </div>
              <div className={styles.add}>
                <Form className={styles['filter-form']}>
                  <div className={styles['filter-form-left']}>
                    <Form.Field className={styles['evaluation-field']}>
                      <label className={styles.label}>
                        <FormattedMessage id='toggles.filter.evaluated' />
                      </label>
                      <Dropdown
                        fluid 
                        selection
                        floating
                        clearable
                        selectOnBlur={false}
                        value={search.get('visitFilter') ?? ''}
                        className={styles['dropdown']}
                        placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                        options={evaluationOptions()} 
                        icon={<Icon customclass={styles['angle-down']} type={searchParams.visitFilter ? 'remove-circle' : 'angle-down'} />}
                        onChange={handleEvaluationChange}
                      />
                    </Form.Field>
                    <Form.Field className={styles['status-field']}>
                      <label className={styles.label}>
                        <FormattedMessage id='toggles.filter.status' />
                      </label>
                      <Dropdown 
                        fluid 
                        selection 
                        floating
                        clearable
                        className={styles['status-dropdown']}
                        value={search.get('disabled') ? search.get('disabled') === 'true' : ''}
                        selectOnBlur={false}
                        placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                        options={statusOptions()}
                        icon={<Icon customclass={styles['angle-down']} type={search.get('disabled') ? 'remove-circle' : 'angle-down'} />}
                        onChange={handleStatusChange}
                      />
                    </Form.Field>
                    <Form.Field className={styles['tags-field']}>
                      <label className={styles.label}>
                        <FormattedMessage id='common.tags.text' />
                      </label>
                      <Dropdown 
                        fluid 
                        multiple 
                        selection 
                        floating
                        clearable
                        selectOnBlur={false}
                        className={styles['dropdown']}
                        placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                        options={tagOptions}
                        value={search.get('tags') ? search.get('tags')?.split(',') : []}
                        renderLabel={renderLabel}
                        onChange={handleTagsChange}
                        icon={<Icon customclass={styles['angle-down']} type={searchParams.tags && searchParams.tags.length > 0 ? 'remove-circle' : 'angle-down'} />}
                      />
                    </Form.Field>
                    <Form.Field className={styles['permanent-field']}>
                      <label className={styles.label}>
                        <FormattedMessage id='toggles.filter.permanent.status' />
                      </label>
                      <Dropdown 
                        fluid 
                        selection 
                        floating
                        clearable
                        className={styles['permanent-dropdown']}
                        selectOnBlur={false}
                        placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                        value={search.get('permanent') ? search.get('permanent') === 'true' : ''}
                        options={permanentOptions()}
                        icon={<Icon customclass={styles['angle-down']} type={typeof searchParams.permanent === 'boolean' ? 'remove-circle' : 'angle-down'} />}
                        onChange={handlePermanentChange}
                      />
                    </Form.Field>
                  </div>
                  <div className={styles['filter-form-right']}>
                    <Form.Field className={styles['keywords-field']}>
                      <Form.Input 
                        placeholder={intl.formatMessage({id: 'toggles.filter.search.placeholder'})} 
                        icon={<Icon customclass={styles['icon-search']} type='search' />}
                        value={search.get('keyword') ?? ''}
                        onChange={handleSearch}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        className={styles.checkbox}
                        onChange={(e, detail: CheckboxProps) => {
                          handleRelated(detail);
                        }}
                        checked={search.get('related') ? search.get('related') === 'true' : false}
                        label={intl.formatMessage({id: 'toggles.filter.related.me'})} 
                      />
                      <Popup
                        inverted
                        trigger={
                          <Icon customclass={styles['icon-info']} type='info' />
                        }
                        content={
                          <span className={styles['icon-tips']}>
                            { intl.formatMessage({id: 'toggles.filter.related.me.tips'}) }
                          </span>
                        }
                        position='top right'
                        className='popup-override'
                      />
                    </Form.Field>
                  </div>
                </Form>
              </div>
              {
                isLoading ? (
                  <div className={styles.lists}>
                    { isLoading && <Loading /> }
                  </div>
                ) : (
                  <>
                    <div className={styles.lists}>
                      <Table basic='very' unstackable>
                        <Table.Header className={styles['table-header']}>
                          <Table.Row>
                            <Table.HeaderCell className={styles['column-brief']}>
                              <FormattedMessage id='toggles.table.brief' />
                            </Table.HeaderCell>
                            {
                              enableApproval && (
                                <Table.HeaderCell className={styles['column-publishing-status']}>
                                  <div>
                                    <FormattedMessage id='toggles.table.publishing.status' />
                                    <Filter
                                      selected={releaseStatusList.length > 0}
                                      customStyle={{ width: '180px' }}
                                      handleConfirm={() => {
                                        setSearchParams({
                                          ...searchParams,
                                          pageIndex: 0,
                                          releaseStatusList,
                                        });
                                      }}
                                      handleClear={() => {
                                        saveReleaseStatusList([]);
                                      }}
                                    >
                                      <div className={styles['menu']}>
                                        <div className={styles['menu-item']}>
                                          <Checkbox 
                                            label={intl.formatMessage({id: 'approvals.status.pending'})}
                                            checked={releaseStatusList.includes('PENDING_APPROVAL')}
                                            onChange={(e: SyntheticEvent) => {
                                              e.stopPropagation();
                                              handleChange('PENDING_APPROVAL');
                                            }}
                                          />
                                        </div>
                                        <div className={styles['menu-item']}>
                                          <Checkbox 
                                            label={intl.formatMessage({id: 'approvals.status.unpublished'})}
                                            checked={releaseStatusList.includes('PENDING_RELEASE')}
                                            onChange={(e: SyntheticEvent) => {
                                              e.stopPropagation();
                                              handleChange('PENDING_RELEASE');
                                            }}
                                          />
                                        </div>
                                        <div className={styles['menu-item']}>
                                          <Checkbox 
                                            label={intl.formatMessage({id: 'approvals.status.declined'})}
                                            checked={releaseStatusList.includes('REJECT')}
                                            onChange={(e: SyntheticEvent) => {
                                              e.stopPropagation();
                                              handleChange('REJECT');
                                            }}
                                          />
                                        </div>
                                        <div className={styles['menu-item']}>
                                          <Checkbox 
                                            label={intl.formatMessage({id: 'approvals.status.published'})}
                                            checked={releaseStatusList.includes('RELEASE')}
                                            onChange={(e: SyntheticEvent) => {
                                              e.stopPropagation();
                                              handleChange('RELEASE');
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </Filter>
                                  </div>
                                </Table.HeaderCell>
                              )
                            }
                            <Table.HeaderCell className={styles['column-status']}>
                              <FormattedMessage id='toggles.table.status' />
                            </Table.HeaderCell>
                            <Table.HeaderCell className={styles['column-type']}>
                              <FormattedMessage id='common.type.text' />
                            </Table.HeaderCell>
                            <Table.HeaderCell className={styles['column-tags']}>
                              <FormattedMessage id='common.tags.text' />
                            </Table.HeaderCell>
                            <Table.HeaderCell className={styles['column-evaluated']}>
                              <FormattedMessage id='toggles.table.evaluation' />
                            </Table.HeaderCell>
                            <Table.HeaderCell className={styles['column-operation']}></Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        {
                          isLoading ? (
                            <div className={styles.lists}>
                              { isLoading && <Loading /> }
                            </div>
                          ) : (
                            <>
                              {
                                toggleList.length !== 0 && (
                                  <Table.Body className={styles['table-body']}>
                                    {
                                      toggleList?.map((toggle: IToggle) => {
                                        return (
                                          <ToggleItem 
                                            key={toggle.key}
                                            toggle={toggle} 
                                            isArchived={isArchived}
                                            enableApproval={enableApproval}
                                            setIsAdd={setIsAdd}
                                            refreshToggleList={refreshToggleList}
                                            setDrawerVisible={setDrawerVisible}
                                          />
                                        );
                                      })
                                    }
                                  </Table.Body>
                                )
                              }
                            </>
                          )
                        }
                      </Table>
                      {
                        toggleList.length !== 0 ? (
                          <Pagination
                            total={total}
                            pagination={pagination}
                            handlePageChange={handlePageChange}
                          />
                        ) : <NoData />
                      }
                    </div>
                  </>
                )
              }
            </div>
            <ToggleDrawer 
              isAdd={isAdd}
              visible={visible}
              setDrawerVisible={setDrawerVisible}
              refreshToggleList={refreshToggleList}
            />
          </>
        </Provider>
      </div>
    </ProjectLayout>
	);
};

export default Toggle;
