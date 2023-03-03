import { SyntheticEvent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import { IMetricIteration } from 'interfaces/analysis';
import styles from './index.module.scss';

interface IProps {
  item: IMetricIteration;
}

const TimeLine = (props: IProps) => {
  const { item } = props;
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

  return (
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
  );
};

export default TimeLine;