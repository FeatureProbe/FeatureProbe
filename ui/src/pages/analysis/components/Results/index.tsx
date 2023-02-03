import { useState } from 'react';
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
}

const Results = (props: IProps) => {
  const { eventInfo } = props;
  const [ isCollecting, saveIsCollecting ] = useState<boolean>(false);

  const intl = useIntl();
  const time = '2022-02-09 22:22:22';

  return (
    <div className={styles.result}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.data.text'})}
        showTooltip={false}
      />
      <div className={styles.start}>
        {
          isCollecting && (
            <span className={styles['start-time']}>
              <FormattedMessage id='analysis.result.collect.time' />{time}
            </span>
          )
        }
        {
          !isCollecting ? (
            <Button primary className={styles['start-btn']} disabled={!eventInfo}>
              <FormattedMessage id='analysis.result.collect.start' />
            </Button>
          ) : (
            <Button secondary className={styles['start-btn']}>
              <FormattedMessage id='analysis.result.collect.stop' />
            </Button>
          )
        }
      </div>
      {
        eventInfo ? (
          <div className={styles['result-content']}>
            <ResultTable />
          </div>
        ) : (
          <div className={styles['no-data']}>
            <div className={styles.tips}>
              <Icon customclass={styles['warning-circle']} type='warning-circle' />
              <FormattedMessage id='analysis.result.tip' />
            </div> 
            <NoData />
          </div>
        )
      }
    </div>
  );
};

export default Results;
  