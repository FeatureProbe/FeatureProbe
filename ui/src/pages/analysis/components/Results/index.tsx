import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SectionTitle from 'components/SectionTitle';
import NoData from 'components/NoData';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ResultTable from './components/table';
import { IEvent } from 'interfaces/analysis';

import styles from './index.module.scss';

interface IProps {
  eventInfo?: IEvent;
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  operateTrackCollection(trackEvent: boolean): void;
}

const Results = (props: IProps) => {
  const { trackEvents, allowEnableTrackEvents, operateTrackCollection } = props;
  const [ data, saveData ] = useState([]);

  const intl = useIntl();
  const time = '2022-02-09 22:22:22';

  useEffect(() => {
    saveData([]);
  }, []);

  return (
    <div className={styles.result}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.data.text'})}
        showTooltip={false}
      />
      <div className={styles.start}>
        {
          trackEvents && (
            <span className={styles['start-time']}>
              <FormattedMessage id='analysis.result.collect.time' />{time}
            </span>
          )
        }
        {
          !trackEvents ? (
            <Button 
              primary 
              className={styles['start-btn']} 
              disabled={!allowEnableTrackEvents} 
              onClick={() => {
                operateTrackCollection(true);
              }}
            >
              <FormattedMessage id='analysis.result.collect.start' />
            </Button>
          ) : (
            <Button 
              secondary 
              className={styles['start-btn']}
              onClick={() => {
                operateTrackCollection(false);
              }}
            >
              <FormattedMessage id='analysis.result.collect.stop' />
            </Button>
          )
        }
      </div>

      {
        allowEnableTrackEvents && data.length > 0 && (
          <div className={styles['result-content']}>
            <ResultTable />
          </div>
        )
      }

      <div className={styles['no-data']}>
        {
          (!allowEnableTrackEvents || (allowEnableTrackEvents && !trackEvents)) && (
            <div className={styles.tips}>
              <Icon customclass={styles['warning-circle']} type='warning-circle' />
              <FormattedMessage id='analysis.result.tip' />
            </div>
          )
        }
        {
          data.length === 0 && <NoData />
        }
      </div>
    </div>
  );
};

export default Results;
  