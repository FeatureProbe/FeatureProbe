import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, PaginationProps, Table } from 'semantic-ui-react';
import SettingCard from 'layout/settingCard';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import Pagination from 'components/Pagination';
import NoData from 'components/NoData';
import { ITokenListItem, ITokenListResponse, TOKENTYPE } from 'interfaces/token';
import { Provider } from './provider';
import { getTokenList } from 'services/tokens';
import message from 'components/MessageBox';
import TokenItem from './components/TokenItem';
import TokenModal from './components/TokenModal';
import UserSettingLayout from 'layout/userSettingLayout';
import styles from './index.module.scss';

const ApiToken = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenList, saveTokenList] = useState<ITokenListItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [total, setTotal] = useState({
    totalPages: 0,
    total: 0,
  });
  const [page, setPage] = useState(0);
  const intl = useIntl();

  const handleAddToken = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handlePageChange = useCallback((e, data: PaginationProps) => {
    setPage((data.activePage as number) - 1);
  }, []);

  const handleCancelAdd = useCallback(() => {
    setModalOpen(false);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getTokenList<ITokenListResponse>({
        type: TOKENTYPE.PERSON,
        pageIndex: page,
        pageSize: 10,
      });
      if (res.success && res.data) {
        saveTokenList(res.data.content);
        setTotal({
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
        });
      } else {
        message.error(intl.formatMessage({ id: 'token.list.error' }));
      }
    } catch {
      message.error(intl.formatMessage({ id: 'token.list.error' }));
    } finally {
      setIsLoading(false);
    }
  }, [intl, page]);

  useEffect(() => {
    load();
  }, [load, page]);

  return (
    <UserSettingLayout>
      <Provider>
        <SettingCard title={<FormattedMessage id="token.personal.title" />}>
          <div className={styles['description']}>
            <FormattedMessage id="token.card.personal.description" />
          </div>
          <div className={styles['action-line']}>
            <div className={styles.buttons}>
              <Button primary className={styles['add-button']} onClick={handleAddToken}>
                <Icon customclass={styles['iconfont']} type="add" />
                Token
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className={styles['loading-box']}>
              <Loading />
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
                        <Table.HeaderCell className={styles['column-last-time']}>
                          <FormattedMessage id="token.visited.time" />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-opt']}>
                          <FormattedMessage id="common.operation.text" />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <>
                      {tokenList.length !== 0 && (
                        <Table.Body className={styles['table-body']}>
                          {tokenList.map((item) => {
                            return <TokenItem token={item} refresh={load} />;
                          })}
                        </Table.Body>
                      )}
                    </>
                  </Table>
                  {tokenList.length === 0 && <NoData />}
                </div>
              </div>
              {tokenList.length !== 0 && (
                <Pagination
                  total={total.total}
                  pagination={{
                    pageIndex: page,
                    totalPages: total.totalPages,
                  }}
                  handlePageChange={handlePageChange}
                />
              )}
            </>
          )}
          <TokenModal refresh={load} handleCancel={handleCancelAdd} open={modalOpen} />
        </SettingCard>
      </Provider>
    </UserSettingLayout>
  );
};

export default ApiToken;
