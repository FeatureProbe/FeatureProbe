import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import Record from '../record';
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
                    <Record 
                      item={item}
                    />
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