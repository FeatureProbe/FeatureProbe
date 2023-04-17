import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, Table } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';
import NoData from 'components/NoData';
import Filter from 'components/Filter';
import TableItem from '../TableItem';
import { IEvent } from 'interfaces/eventTracker';

import styles from './index.module.scss';

interface IProps {
  type: string;
  events: IEvent[];
}

const List = (props: IProps) => {
  const { type, events } = props;
  const [ typeList, saveTypeList ] = useState<string[]>([]);
  const [ displayEvents, saveDisplayEvents ] = useState<IEvent[]>(events);
  const intl = useIntl();

  useEffect(() => {
    saveTypeList([]);
  }, [type]);

  // Change filter type
  const handleChange = useCallback((status) => {
    if (typeList.includes(status)) {
      const index = typeList.indexOf(status);
      typeList.splice(index, 1);
    } else {
      typeList.push(status);
    }
    saveTypeList(cloneDeep(typeList));
  }, [typeList]);

  useEffect(() => {
    if (typeList.length === 0) {
      saveDisplayEvents(events);
      return;
    }
    
    const displayEvents = events.filter((event) => {
      return typeList.includes(event.kind);
    });

    saveDisplayEvents(displayEvents);
  }, [typeList, events]);

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
        {
          displayEvents?.length !== 0 && (
            <Table.Body className={styles['table-body']}>
              {
                displayEvents?.map((event: IEvent, index: number) => {
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
        displayEvents.length === 0 && (
          <NoData text={getNoDataText()} />
        )
      }
    </div>
  );
};

export default List;
