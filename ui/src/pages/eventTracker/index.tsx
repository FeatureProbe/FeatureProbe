import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { useParams } from 'react-router';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import List from './components/List';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ProjectLayout from 'layout/projectLayout';
import { getEventsStream, changeEventTrackerStatus } from 'services/eventTracker';
import { IEvent, IEventStream } from 'interfaces/eventTracker';

import styles from './index.module.scss';
import dayjs from 'dayjs';

interface IParams {
  projectKey: string;
  environmentKey: string;
}

const EventTracker = () => {
  const [ selectedNav, saveSelectedNav ] = useState<string>('all');
  const [ open, saveOpen ] = useState<boolean>(false);
  const { projectKey, environmentKey } = useParams<IParams>();
  const [ uuid, saveUuid ] = useState<string>(uuidv4());
  const [ events, saveEvents ] = useState<IEvent[]>([]);
  const [ debugUntilTime, saveDebugUntilTime ] = useState<number>(0);
  const [ allEvents, saveAllEvents ] = useState<IEvent[]>([]);
  const [ toggleEvents, saveToggleEvents ] = useState<IEvent[]>([]);
  const [ metricEvents, saveMetricEvents ] = useState<IEvent[]>([]);
  const [ originAllEvents, saveOriginAllEvents ] = useState<IEvent[]>([]);
  const [ originToggleEvents, saveOriginToggleEvents ] = useState<IEvent[]>([]);
  const [ originMetricEvents, saveOriginMetricEvents ] = useState<IEvent[]>([]);
  const [ search, saveSearch ] = useState<string>('');
  const intl = useIntl();
  const timer: { current: NodeJS.Timeout | null } = useRef(null);

  useEffect(() => {
    const all = originAllEvents.concat(events);
    const toggle = all.filter(item => item.kind === 'access' || item.kind === 'debug' || item.kind === 'summary');
    const metric = all.filter(item => item.kind === 'pageview' || item.kind === 'click' || item.kind === 'custom');

    saveAllEvents(all);
    saveToggleEvents(toggle);
    saveMetricEvents(metric);
    saveOriginAllEvents(all);
    saveOriginToggleEvents(toggle);
    saveOriginMetricEvents(metric);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const getData = useCallback(() => {
    getEventsStream<IEventStream>(projectKey, environmentKey, uuid).then(res => {
      const { success, data } = res;

      if (success && data) {
        saveDebugUntilTime(data.debugUntilTime);
        saveOpen(data.debuggerEnabled);
        saveEvents(data.events);
        
        if (!data.debuggerEnabled) {
          clearInterval(timer.current as NodeJS.Timeout);
        }
      }
    });
  }, [projectKey, environmentKey, uuid]);

  const clearEvents = useCallback(() => {
    saveAllEvents([]);
    saveToggleEvents([]);
    saveMetricEvents([]);
    saveOriginAllEvents([]);
    saveOriginToggleEvents([]);
    saveOriginMetricEvents([]);
  }, []);

  useEffect(() => {
    clearEvents();
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, [projectKey, environmentKey, clearEvents]);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    getData();
    timer.current = setInterval(getData, 5000);
    
    return () => {
      clearInterval(timer.current as NodeJS.Timeout);
    };
  }, [getData]);

  useEffect(() => {
    const all = cloneDeep(originAllEvents);
    const toggle = cloneDeep(originToggleEvents);
    const metric = cloneDeep(originMetricEvents);

    if (search !== '') {
      const filterAll = all.filter(item => search === item.key || search === item.name);
      const filterToggle = toggle.filter(item => search === item.key || search === item.toggleKey);
      const filterMetric = metric.filter(item => search === item.name);

      saveAllEvents(filterAll);
      saveToggleEvents(filterToggle);
      saveMetricEvents(filterMetric);
    } else {
      saveAllEvents(all);
      saveToggleEvents(toggle);
      saveMetricEvents(metric);
    }
  }, [search, originAllEvents, originToggleEvents, originMetricEvents]);

  const allCls = classNames(styles['navs-item'], {
    [styles['navs-item-selected']]: selectedNav === 'all'
  });

  const toggleCls = classNames(styles['navs-item'], {
    [styles['navs-item-selected']]: selectedNav === 'toggle'
  });

  const metricCls = classNames(styles['navs-item'], {
    [styles['navs-item-selected']]: selectedNav === 'metric'
  });

  const handleSearch = useCallback((e: SyntheticEvent, detail: InputOnChangeData) => {
    saveSearch(detail.value);
  }, []);

  const getByPlaceholderText = useCallback(() => {
    if (selectedNav === 'all') {
      return intl.formatMessage({ id: 'event.tracker.search.key.event' });
    } else if (selectedNav === 'toggle') {
      return intl.formatMessage({ id: 'event.tracker.search.key' });
    } else if (selectedNav === 'metric') {
      return intl.formatMessage({ id: 'event.tracker.search.event' });
    }
  }, [selectedNav, intl]);
  
  const handleEventTrackerEnabled = useCallback((enabled: boolean) => {
    saveDebugUntilTime(0);
    changeEventTrackerStatus(projectKey, environmentKey, {
      enabled
    }).then(res => {
      const { success } = res;
      if (success) {
        saveOpen(enabled);
        saveUuid(uuidv4());
        if (enabled) {
          clearEvents();
        }
      }
    });
  }, [projectKey, environmentKey, clearEvents]);

  const gotoBottom = useCallback(() => {
    const element = document.querySelector('.scroll-container');
    if (element) {
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 400);
    }
  }, []);

  return (
    <ProjectLayout>
      <div className={styles['event-tracker']}>
        <div className={`scroll-container ${styles.card}`}>
          <div className={styles.heading}>
            <FormattedMessage id='common.event.tracker.text' />
          </div>
          <div className={styles.status}>
            <div className={styles.description}>
              <FormattedMessage id='event.tracker.description' />
            </div>
            <div>
              {
                open ? (
                  <>
                    <Icon type='success-circle' customclass={styles['icon-success']} />
                      <span className={styles['text-success']}>
                        <FormattedMessage id='event.tracker.status.open' />
                        {
                          debugUntilTime !== 0 && (
                            <>
                              <FormattedMessage id='event.tracker.until.time.left' />
                              { dayjs(debugUntilTime).diff(dayjs(Date.now()), 'minute')}
                              <FormattedMessage id='event.tracker.until.time.right' />
                            </>
                          )
                        }
                      </span>
                      <Button type='button' secondary onClick={() => {
                        handleEventTrackerEnabled(false);
                      }}>
                        <span className={styles['btn-text']}>
                          <FormattedMessage id='event.tracker.operate.close' />
                        </span>
                      </Button>
                  </>
                ) : (
                  <>
                    <Icon type='error-circle' customclass={styles['icon-error']} />
                    <span className={styles['text-success']}>
                      <FormattedMessage id='event.tracker.status.close' />
                    </span>
                    <Button type='button' primary onClick={() => {
                      handleEventTrackerEnabled(true);
                    }}>
                      <span className={styles['btn-text']}>
                        <FormattedMessage id='event.tracker.operate.open' />
                      </span>
                    </Button>
                  </>
                )
              }
            </div>
          </div>
          <div className={styles.operate}>
            <div className={styles.navs}>
              <div 
                className={allCls} 
                onClick={() => { 
                  saveSelectedNav('all');
                }}
              >
                <FormattedMessage id='common.all.text' />
                <span className={styles['navs-count']}>
                  ({allEvents.length})
                </span>
              </div>
              <div 
                className={toggleCls} 
                onClick={() => { 
                  saveSelectedNav('toggle');
                }}
              >
                <FormattedMessage id='common.toggles.text' />
                <span className={styles['navs-count']}>
                  ({toggleEvents.length})
                </span>
              </div>
              <div 
                className={metricCls} 
                onClick={() => { 
                  saveSelectedNav('metric');
                }}
              >
                <FormattedMessage id='common.metrics.text' />
                <span className={styles['navs-count']}>
                  ({metricEvents.length})
                </span>
              </div>
            </div>
            <div className={styles.search}>
              <Form>
                <Form.Field>
                  <Form.Input
                    className={styles.input}
                    placeholder={getByPlaceholderText()} 
                    icon={<Icon customclass={styles['icon-search']} type='search' />}
                    onChange={handleSearch}
                  />
                </Form.Field>
              </Form>
            </div>
          </div>
          <List
            open={open}
            type={selectedNav}
            events={selectedNav === 'all' ? allEvents : selectedNav === 'toggle' ? toggleEvents : metricEvents}
          />
          {
            (selectedNav === 'all' ? allEvents : selectedNav === 'toggle' ? toggleEvents : metricEvents).length > 0 && (
              <div className={styles.bottom} onClick={gotoBottom}>
                <Icon type='angle-down' customclass={styles['angle-down']} />
              </div>
            )
          }
        </div>
      </div>
    </ProjectLayout>
  );
};

export default EventTracker;
