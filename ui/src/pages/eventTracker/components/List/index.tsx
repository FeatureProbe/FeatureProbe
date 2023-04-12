import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, PaginationProps, Table } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import Pagination from 'components/Pagination';
import NoData from 'components/NoData';
import Filter from 'components/Filter';
import styles from './index.module.scss';

interface IProps {
  type: string;
}

const List = (props: IProps) => {
  const { type } = props;
  const [ isLoading, saveIsLoading ] = useState<boolean>(false);
  const [ events, saveEvents ] = useState<any[]>([]);
  const [ typeList, saveTypeList ] = useState<string[]>([]);
  const [ pagination, savePagination ] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const intl = useIntl();

  useEffect(() => {
    saveTypeList([]);
  }, [type]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    //
  }, []);

  // Change filter type
  const handleChange = useCallback((status) => {
    if (typeList.includes(status)) {
      const index = typeList.indexOf(status);
      typeList.splice(index, 1);
    } else {
      typeList.push(status);
    }
    saveTypeList(cloneDeep(typeList));
  }, [typeList, saveTypeList]);

  const getNoDataText = useCallback(() => {
    return (
      <div className={styles['no-data']}>
        <div className={styles['no-data-text']}>
          {intl.formatMessage({ id: 'event.tracker.no.data1' })}
        </div>
        <div className={styles['no-data-text']}>
          {intl.formatMessage({ id: 'event.tracker.no.data2' })}
        </div>
      </div>
    );
  }, [intl]);

  return (
    <div className={styles.table}>
      <Table basic='very' unstackable>
        <Table.Header className={styles['table-header']}>
          <Table.Row>
            <Table.HeaderCell className={styles['column-time']}>
              <FormattedMessage id='event.tracker.table.time' />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id='event.tracker.table.type' />
              <Filter
                selected={typeList.length > 0}
                customStyle={{ width: '130px' }}
                handleConfirm={() => {
                  //
                }}
                handleClear={() => {
                  saveTypeList([]);
                }}
              >
                <div className={styles['filter-menu']}>
                  {
                    (type === 'all' || type === 'toggle') && (
                      <div>
                        <div className={styles['filter-menu-item']}>
                          <Checkbox 
                            label={intl.formatMessage({id: 'event.tracker.type.access'})}
                            checked={typeList.includes('access')}
                            onChange={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              handleChange('access');
                            }}
                          />
                        </div>
                        <div className={styles['filter-menu-item']}>
                          <Checkbox 
                            label={intl.formatMessage({id: 'event.tracker.type.summary'})}
                            checked={typeList.includes('summary')}
                            onChange={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              handleChange('summary');
                            }}
                          />
                        </div>
                        <div className={styles['filter-menu-item']}>
                          <Checkbox 
                            label={intl.formatMessage({id: 'event.tracker.type.debug'})}
                            checked={typeList.includes('debug')}
                            onChange={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              handleChange('debug');
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                  {
                    (type === 'all' || type === 'metric') && (
                      <div>
                        <div className={styles['filter-menu-item']}>
                          <Checkbox 
                            label={intl.formatMessage({id: 'analysis.event.custom'})}
                            checked={typeList.includes('custom')}
                            onChange={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              handleChange('custom');
                            }}
                          />
                        </div>
                        <div className={styles['filter-menu-item']}>
                          <Checkbox 
                            label={intl.formatMessage({id: 'analysis.event.pageview'})}
                            checked={typeList.includes('pageview')}
                            onChange={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              handleChange('pageview');
                            }}
                          />
                        </div>
                        <div className={styles['filter-menu-item']}>
                          <Checkbox 
                            label={intl.formatMessage({id: 'analysis.event.click'})}
                            checked={typeList.includes('click')}
                            onChange={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              handleChange('click');
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                </div>
              </Filter>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id='event.tracker.table.user' />
            </Table.HeaderCell>
            {
              (type === 'all' || type === 'metric') && (
                <Table.HeaderCell>
                  <FormattedMessage id='event.tracker.table.event' />
                </Table.HeaderCell>
              )
            }
            {
              type === 'toggle' && (
                <>
                  <Table.HeaderCell>
                    <FormattedMessage id='event.tracker.table.toggle.key' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='event.tracker.table.evaluation.reason' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='event.tracker.table.variation' />
                  </Table.HeaderCell>
                </>
              )
            }
            {
              type === 'metric' && (
                <Table.HeaderCell>
                  <FormattedMessage id='event.tracker.table.value' />
                </Table.HeaderCell>
              )
            }
            <Table.HeaderCell className={styles['column-operation']}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
      {
        events.length !== 0 ? (
          <Pagination
            total={1}
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        ) : (
          <NoData text={getNoDataText()} />
        )
      }
    </div>
  );
};

export default List;
