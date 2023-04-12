import { Form, Input } from 'semantic-ui-react';
import classNames from 'classnames';
import ProjectLayout from 'layout/projectLayout';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import List from './components/List';
import Button from 'components/Button';

import styles from './index.module.scss';
import Icon from 'components/Icon';

const EventTracker = () => {
  const [ selectedNav, saveSelectedNav ] = useState<string>('all');
  const [ open, saveOpen ] = useState<boolean>(false);
  const intl = useIntl();


  const allCls = classNames(styles['navs-item'], {
    [styles['navs-item-selected']]: selectedNav === 'all'
  });

  const toggleCls = classNames(styles['navs-item'], {
    [styles['navs-item-selected']]: selectedNav === 'toggle'
  });

  const metricCls = classNames(styles['navs-item'], {
    [styles['navs-item-selected']]: selectedNav === 'metric'
  });

  const handleSearch = useCallback(() => {
    //
  }, []);

  const getByPlaceholderText = useCallback(() => {
    if (selectedNav === 'all') {
      return intl.formatMessage({ id: 'event.tracker.search.key.event' });
    } else if (selectedNav === 'toggle') {
      return intl.formatMessage({ id: 'event.tracker.search.key' });
    } else if (selectedNav === 'metric') {
      return intl.formatMessage({ id: 'event.tracker.search.event' });
    }
  }, [selectedNav]);

  return (
    <ProjectLayout>
      <div className={styles.debugger}>
        <div className={styles.card}>
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
                      </span>
                      <Button type='button' secondary onClick={() => {
                        //
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
                      //
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
              </div>
              <div 
                className={toggleCls} 
                onClick={() => { 
                  saveSelectedNav('toggle');
                }}
              >
                <FormattedMessage id='common.toggles.text' />
              </div>
              <div 
                className={metricCls} 
                onClick={() => { 
                  saveSelectedNav('metric');
                }}
              >
                <FormattedMessage id='common.metrics.text' />
              </div>
            </div>
            <div className={styles.search}>
              <Form>
                <Form.Field>
                  <Form.Input
                    className={styles.input}
                    placeholder={getByPlaceholderText()} 
                    icon={<Icon customclass={styles['icon-search']} type='search' />}
                    // value={''}
                    onChange={handleSearch}
                  />
                </Form.Field>
              </Form>
              <span className={styles.refresh}>
                <Icon type='refresh' />
              </span>
            </div>
          </div>
          <List
            type={selectedNav}
          />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default EventTracker;
