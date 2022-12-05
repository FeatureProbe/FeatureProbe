import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Form, Table, InputOnChangeData, PaginationProps, Checkbox } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { cloneDeep, debounce } from 'lodash';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import NoData from 'components/NoData';
import Pagination from 'components/Pagination';
import Loading from 'components/Loading';
import ListItem from '../ListItem';
import { IApproval, IApprovalList } from 'interfaces/approval';
import { getApprovalList } from 'services/approval';
import styles from './index.module.scss';

const LIST = '/approvals/list';
const MINE = '/approvals/mine';

const Lists = () => {
	const intl = useIntl();
	const [ type, saveType ] = useState<string>('APPROVAL');
	const [ keyword, saveKeyword ] = useState<string>('');
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const [ pageIndex, savePageIndex ] = useState<number>(0);
  const [ pagination, setPagination ] = useState({
		pageIndex: 1,
		totalPages: 5,
	});
  const [ statusList, saveStatusList ] = useState<string[]>(['PENDING']);
	const [ approvalList, saveApprovalList ] = useState<IApproval[]>([]);
	const [ total, setTotal ] = useState<number>(0);

	useEffect(() => {
		if (window.location.pathname === LIST) {
			saveType('APPROVAL');
		} else if (window.location.pathname === MINE) {
			saveType('APPLY');
		}
		saveStatusList(['PENDING']);
    savePageIndex(0);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.pathname]);

	const init = useCallback(() => {
    saveIsLoading(true);
		getApprovalList<IApprovalList>({
			pageIndex,
      pageSize: 10,
			status: statusList,
			type,
			keyword,
		}).then(res => {
      saveIsLoading(false);
			const { success, data } = res;
			if (success && data) {
				const { content, pageable, totalPages, totalElements } = data;
				saveApprovalList(content);
				setPagination({
					pageIndex: (pageable?.pageNumber || 0) + 1,
          totalPages: totalPages || 1,
				});
				setTotal(totalElements || 0);
			}
      else {
        message.error(intl.formatMessage({id: 'approvals.lists.error'}));
      }
		});
  }, [intl, type, statusList, keyword, pageIndex]);

  useEffect(() => {
    init();
  }, [init]);

  const handleSearch = debounce(useCallback((e: SyntheticEvent, detail: InputOnChangeData) => {
    savePageIndex(0);
    saveKeyword(detail.value);
  }, []), 300);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    savePageIndex(Number(data.activePage) - 1);
  }, []);

  const handleChange = useCallback((status) => {
    if (statusList.includes(status)) {
      const index = statusList.indexOf(status);
      statusList.splice(index, 1);
    } else {
      statusList.push(status);
    }
    savePageIndex(0);
    saveStatusList(cloneDeep(statusList));
  }, [statusList, saveStatusList]);

  return (
    <div className={styles.lists}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <div className={styles['tabs-item']}>
            <Checkbox
              checked={statusList.includes('PENDING')}
              label={intl.formatMessage({id: 'approvals.status.pending'})}
              onChange={() => {
                handleChange('PENDING');
              }}
            />
          </div>
          {
            type === 'APPLY' && (
              <>
                <div className={styles['tabs-item']}>
                  <Checkbox 
                    label={intl.formatMessage({id: 'approvals.status.accepted'})}
                    checked={statusList.includes('PASS')}
                    onChange={() => {
                      handleChange('PASS');
                    }}
                  />
                </div>
                <div className={styles['tabs-item']}>
                  <Checkbox 
                    label={intl.formatMessage({id: 'approvals.status.declined'})} 
                    onChange={() => {
                      handleChange('REJECT');
                    }}
                  />
                </div>
                <div className={styles['tabs-item']}>
                  <Checkbox 
                    label={intl.formatMessage({id: 'approvals.status.skipped'})} 
                    onChange={() => {
                      handleChange('JUMP');
                    }}
                  />
                </div>
                <div className={styles['tabs-item']}>
                  <Checkbox 
                    label={intl.formatMessage({id: 'approvals.status.withdrawn'})} 
                    onChange={() => {
                      handleChange('REVOKE');
                    }} 
                  />
                </div>
              </>
            )
          }
        </div>
        <Form className={styles.form}>
          <Form.Field className={styles['keywords-field']}>
            <Form.Input 
              placeholder={intl.formatMessage({id: 'toggles.filter.search.placeholder'})} 
              icon={<Icon customclass={styles['icon-search']} type='search' />}
              onChange={handleSearch}
            />
          </Form.Field>
        </Form>
      </div>
      {
        isLoading ? (
          <div className={styles.content}>
            <Loading />
          </div>
        ) : (
          <div className={styles.content}>
            <Table basic='very' unstackable>
              <Table.Header className={styles['table-header']}>
                <Table.Row>
                  <Table.HeaderCell className={styles['column-title']}>
                    <FormattedMessage id='targeting.publish.modal.comment' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-toggle']}>
                    <FormattedMessage id='common.toggle.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='approvals.table.header.status' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='common.project.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='common.environment.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='approvals.table.header.request' />
                  </Table.HeaderCell>
                  {
                    type === 'APPLY' && (
                      <Table.HeaderCell className={styles['column-reviewers']}>
                        <FormattedMessage id='toggles.settings.approval.reviewers' />
                      </Table.HeaderCell>
                    )
                  }
                  <Table.HeaderCell>
                    <FormattedMessage id='approvals.table.header.review' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='approvals.table.header.comment' />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  approvalList?.map((approval: IApproval) => {
                    return (
                      <ListItem
                        key={approval.createdTime}
                        type={type}
                        approval={approval}
                      />
                    );
                  })
                }
              </Table.Body>
            </Table>
            {
              approvalList.length === 0 ? <NoData /> : (
                <Pagination
                  total={total}
                  text={intl.formatMessage({id: 'approvals.total'})}
                  pagination={pagination}
                  handlePageChange={handlePageChange}
                />
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default Lists;