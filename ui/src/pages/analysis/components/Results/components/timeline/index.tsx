import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import { IMetricIteration } from 'interfaces/analysis';
import styles from './index.module.scss';


interface IProps {
  iterations: IMetricIteration[]
}

const TimeLine = (props: IProps) => {
  const { iterations } = props;

  const [ width, saveWidth ] = useState<string | number>(0);
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [menuOpen]);

  const handleResize = useCallback(() => {
    if (document.querySelector('.result')) {
      saveWidth((document.querySelector('.result')?.clientWidth ?? 50) - 50);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  return (
    <div className={styles.timeline} style={{width}}>
      {
        iterations.map((item, index) => {
          return (
            <div className={styles.record} key={index}>
              <div className={styles['record-start']}>
                {
                  item.records && item.records.length > 0 && (
                    <Popup
                      basic
                      open={menuOpen}
                      on='click'
                      position='bottom left'
                      className={styles.popup}
                      hideOnScroll={true}
                      trigger={
                        <div 
                          className={styles['record-list']} 
                          onClick={(e: SyntheticEvent) => {
                            setMenuOpen(true);
                            e.stopPropagation();
                          }}
                        >
                          <FormattedMessage id='analysis.timeline.toggle.changed' />
                          <Icon type='angle-down' customclass={styles['angle-down']} />
                        </div>
                      }
                    >
                      <div className={styles['record-menu']} onClick={() => {setMenuOpen(false);}}>
                        {
                          item.records.map((record, index) => {
                            return (
                              <div key={record.version} className={styles['record-item']}>
                                <div className={styles['record-left']}>
                                  <div className={`${styles['record-circle']} ${index === 0 && styles['record-circle-first']}`}></div>
                                </div>
                                <div className={styles['record-right']}>
                                  <div className={styles['record-title']}>
                                    {record.releaseNote}
                                  </div>
                                  <div className={styles['record-time']}>
                                    {dayjs(record.publishTime).format('YYYY-MM-DD HH:mm:ss')}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </Popup>
                  )
                }
                <div className={styles.line}>
                  <span className={styles.circle}></span>
                  <span className={styles.divider}></span>
                </div>
                <div className={`${styles.start} ${styles.button}`}>
                  <FormattedMessage id='analysis.result.collect.start' />
                </div>
                <div className={styles.time}>
                  { dayjs(item.start).format('YYYY-MM-DD HH:mm:ss') }
                </div>
              </div>

              {
                item.stop && (
                  <div>
                    <div className={styles.line}>
                      <span className={styles.circle}></span>
                      <span className={styles.divider}></span>
                    </div>
                    <div className={`${styles.stop} ${styles.button}`}>
                      <FormattedMessage id='analysis.result.collect.stop' />
                    </div>
                    <div className={styles.time}>
                      { dayjs(item.stop).format('YYYY-MM-DD HH:mm:ss') }
                    </div>
                  </div>
                )
              }
            </div>
          );
        })
      }
    </div>
  );
};

export default TimeLine;