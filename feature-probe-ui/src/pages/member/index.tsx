import { useCallback, useEffect, useState, SyntheticEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, PaginationProps } from 'semantic-ui-react';
import SettingLayout from 'layout/settingLayout';
import Button from 'components/Button';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import Loading from 'components/Loading';
import MemberDrawer from './components/MemberDrawer';
import MemberItem from './components/MemberItem';
import NoData from 'components/NoData';
import Pagination from 'components/Pagination';
import { getMemberList } from 'services/member';
import { IMemberList, IMember, IUser } from 'interfaces/member';
import { HeaderContainer } from 'layout/hooks';
import { OWNER } from 'constants/auth';
import styles from './index.module.scss';

const Member = () => {
  const [memberList, setMemberList] = useState<IMember[]>();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, setTotal ] = useState<number>(0);
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false);
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const [ isAdd, setIsAdd ] = useState<boolean>(false);
  const [ editUser, setEditUser ] = useState<IUser>();
  const intl = useIntl();
  const { userInfo } = HeaderContainer.useContainer();

  const fetchMemberList = useCallback(async (pageIndex: number) => {
    const res = await getMemberList<IMemberList>({
      pageIndex,
      pageSize: 10,
    });

    saveIsLoading(false);
    const { success, data } = res;
    if (success && data) {
      const { content, pageable, totalPages, totalElements } = data;
      setMemberList(content);
      setPagination({
        pageIndex: (pageable?.pageNumber || 0) + 1,
        totalPages: totalPages || 1,
      });
      setTotal(totalElements || 0);
      return;
    } else {
      if (res.success)
      setMemberList([]);
      setPagination({
        pageIndex: 1,
        totalPages: 1,
      });
      message.error(intl.formatMessage({id: 'members.list.error.text'}));
    }
  }, [intl]);

  const init = useCallback(() => {
    fetchMemberList(0);
  }, [fetchMemberList]);

  useEffect(() => {
    init();
  }, [init]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    fetchMemberList(Number(data.activePage) - 1);
  }, [fetchMemberList]);

	return (
    <SettingLayout>
      <>
        <div className={styles.member}>
          {
            isLoading ? <Loading /> : (
              <>
                <div className={styles.heading}>
                  <FormattedMessage id='common.members.text' />
                </div>
                {
                  OWNER.includes(userInfo.role) && (
                    <div className={styles.add}>
                      <Button primary className={styles['add-button']} onClick={() => { 
                        setIsAdd(true);
                        setDrawerVisible(true);
                      }}>
                        <Icon customclass={styles['iconfont']} type='add' />
                        <FormattedMessage id='common.member.text' />
                      </Button>
                    </div>
                  )
                }
                <div className={styles.lists}>
                  <Table basic='very' unstackable>
                    <Table.Header className={styles['table-header']}>
                      <Table.Row>
                        <Table.HeaderCell>
                          <FormattedMessage id='common.account.text' />
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          <FormattedMessage id='members.role' />
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          <FormattedMessage id='members.createdby' />
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          <FormattedMessage id='members.lastseen' />
                        </Table.HeaderCell>
                        <Table.HeaderCell className={styles['column-operation']}>
                          <FormattedMessage id='common.operation.text' />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    {
                      memberList?.length !== 0 && (
                        <Table.Body>
                          {
                            memberList?.map((member: IMember) => {
                              return (
                                <MemberItem 
                                  key={member?.account}
                                  member={member} 
                                  setIsAdd={setIsAdd}
                                  setEditUser={setEditUser}
                                  setDrawerVisible={setDrawerVisible}
                                  refreshMemberList={fetchMemberList}
                                />
                              );
                            })
                          }
                        </Table.Body>
                      )
                    }
                  </Table>
                </div>
                {
                  memberList?.length !== 0 ? (
                    <Pagination 
                      total={total}
                      text={intl.formatMessage({id: 'members.total'})}
                      pagination={pagination}
                      handlePageChange={handlePageChange}
                    />
                  ) : <NoData />
                }
              </>
            )
          }
        </div>
        <MemberDrawer 
          isAdd={isAdd}
          visible={drawerVisible}
          editUser={editUser}
          setDrawerVisible={setDrawerVisible}
          refreshMemberList={fetchMemberList}
        />
      </>
    </SettingLayout>
  );
};

export default Member;
