import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Dimmer, Form, InputOnChangeData, Loader, PaginationProps, Table } from 'semantic-ui-react';
import Icon from 'components/Icon';
import SettingLayout from 'layout/settingLayout';
import WebHookItem from './components/webHookItem';
import { cloneDeep, debounce } from 'lodash';
import { IWebHook, IWebHookListResponse } from 'interfaces/webhook';
import WebHookDrawer from './components/WebHookDrawer';
import { Provider } from './provider';
import { getWebHookList } from 'services/webhook';
import message from 'components/MessageBox';
import NoData from 'components/NoData';
import CustomPagination from 'components/Pagination';
import styles from './index.module.scss';

const WebHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [list, saveList] = useState<IWebHook[]>([]);
  const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [drawerValue, saveDrawerValue] = useState<IWebHook>();
  const [search, saveSearch] = useState<string>('');
  const intl = useIntl();

  const handleSearch = debounce(
    useCallback((e, data: InputOnChangeData) => {
      saveSearch(data.value);
    }, []),
    500
  );

  const handleAddWebHook = useCallback(() => {
    setIsAdd(true);
    setDrawerVisible(true);
  }, []);

  const handlePageChange = useCallback((e, data: PaginationProps) => {
    setPagination((pagination) => {
      pagination.pageIndex = typeof data.activePage == 'number' ? data.activePage - 1 : 0;
      return cloneDeep(pagination);
    });
  }, []);

  const fetchWebHookList = useCallback(async () => {
    try {
      const res = await getWebHookList<IWebHookListResponse>({
        pageIndex: pagination.pageIndex,
        pageSize: 10,
        nameLike: search ? search : undefined,
      });
      if (res.success && res.data) {
        saveList(res.data.content);
        setPagination({
          pageIndex: pagination.pageIndex,
          totalPages: res.data.totalPages,
          totalItems: res.data.totalElements,
        });
      }
    } catch {
      message.error(intl.formatMessage({ id: 'webhook.create.failed' }));
    }
  }, [intl, pagination.pageIndex, search]);

  const loadingList = useCallback(async () => {
    setIsLoading(true);
    await fetchWebHookList();
    setIsLoading(false);
  }, [fetchWebHookList]);

  useEffect(() => {
    const timer = setInterval(fetchWebHookList, 5000);
    loadingList();

    return () => {
      clearInterval(timer);
    };
  }, [fetchWebHookList, loadingList]);

  return (
    <SettingLayout>
      <Provider>
        <div className={styles.card}>
          <div className={styles.title}>
            <FormattedMessage id="common.webhooks.text" />
          </div>
          <div className={styles['action-line']}>
            <Form>
              <Form.Field className={styles['keywords-field']}>
                <Form.Input
                  placeholder={intl.formatMessage({ id: 'toggles.filter.search.placeholder' })}
                  icon={<Icon customclass={styles['icon-search']} type="search" />}
                  onChange={handleSearch}
                />
              </Form.Field>
            </Form>
            <div className={styles.buttons}>
              <Button primary className={styles['add-button']} onClick={handleAddWebHook}>
                <Icon customclass={styles['iconfont']} type="add" />
                Webhook
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.load}>
              {isLoading && (
                <Dimmer active inverted>
                  <Loader size="small">
                    <FormattedMessage id="common.loading.text" />
                  </Loader>
                </Dimmer>
              )}
            </div>
          ) : (
            <>
              <div className={styles['table-scroll-box']}>
                <div className={styles['table-box']}>
                  <Table basic="very" unstackable>
                    <Table.Header className={styles['table-header']}>
                      <Table.Row>
                        <Table.HeaderCell className={styles['column-brief']}>
                          <FormattedMessage id="common.name.text" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-description']}>
                          <FormattedMessage id="common.description.text" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-type']}>
                          <FormattedMessage id="toggles.filter.status" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-secret-key']}>
                          <FormattedMessage id="common.secret.key.text" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-recent']}>
                          <FormattedMessage id="webhook.recent.text" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-url']}>
                          <FormattedMessage id="webhook.url.text" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-operation']}>
                          <FormattedMessage id="common.operation.text" />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body className={styles['table-body']}>
                      {list.map((item, index) => {
                        return (
                          <WebHookItem
                            index={index}
                            saveList={saveList}
                            refresh={loadingList}
                            handleEdit={() => {
                              saveDrawerValue(item);
                              setDrawerVisible(true);
                              setIsAdd(false);
                            }}
                            key={item.id}
                            webhook={item}
                          />
                        );
                      })}
                    </Table.Body>
                  </Table>
                  {!list.length && <NoData />}
                </div>
              </div>
              {list.length !== 0 && (
                <CustomPagination
                  pagination={{
                    totalPages: pagination.totalPages,
                    pageIndex: pagination.pageIndex + 1,
                  }}
                  handlePageChange={handlePageChange}
                  total={pagination.totalItems}
                  text={intl.formatMessage({ id: 'webhook.total' })}
                />
              )}
            </>
          )}
          <WebHookDrawer
            refresh={loadingList}
            onClose={() => {
              setDrawerVisible(false);
              saveDrawerValue(undefined);
            }}
            defaultValue={drawerValue}
            isAdd={isAdd}
            visible={isDrawerVisible}
          />
        </div>
      </Provider>
    </SettingLayout>
  );
};

export default WebHook;
