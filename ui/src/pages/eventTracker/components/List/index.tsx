import { SyntheticEvent, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, Table } from 'semantic-ui-react';
import NoData from 'components/NoData';
import Filter from 'components/Filter';
import TableItem from '../TableItem';
import { IEvent } from 'interfaces/eventTracker';

import styles from './index.module.scss';

interface IProps {
  type: string;
  open: boolean;
  events: IEvent[];
  typeList: string[];
  handleChange: (status: string) => void;
  saveTypeList: (typeList: string[]) => void;
}

const List = (props: IProps) => {
  const { type, open, events, typeList, handleChange, saveTypeList } = props;
  const intl = useIntl();

  const getNoDataText = useCallback(() => {
    if (open) {
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
    } else {
      return (
        <div className={styles['no-data']}>
          <div className={styles['no-data-text']}>
            {intl.formatMessage({ id: 'event.tracker.not.open' })}
          </div>
        </div>
      );
    }
  }, [intl, open]);

  return (
    <div className={`scroll-container ${styles.table}`}>
      <Table basic='very' unstackable>
        <Table.Header className={styles['table-header']}>
          <Table.Row>
            <Table.HeaderCell className={styles['column-time']}>
              <FormattedMessage id='event.tracker.table.time' />
            </Table.HeaderCell>
            <Table.HeaderCell className={styles['column-type']}>
              <FormattedMessage id='event.tracker.table.type' />
              <Filter
                selected={typeList.length > 0}
                customStyle={{ width: '130px' }}
                handleConfirm={() => {
                  saveTypeList(typeList);
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
              <FormattedMessage id='event.tracker.table.event' />
            </Table.HeaderCell>
            <Table.HeaderCell className={styles['column-operation']}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {
          events?.length !== 0 && (
            <Table.Body className={styles['table-body']}>
              {
                events?.map((event: IEvent, index: number) => {
                  return (
                    <TableItem
                      key={index}
                      type={type}
                      event={event}
                    />
                  );
                })
              }
            </Table.Body>
          )
        }
      </Table>
      {
        events.length === 0 && <NoData text={getNoDataText()} />
      }
    </div>
  );
};

export default List;
