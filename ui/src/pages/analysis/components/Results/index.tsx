import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SectionTitle from 'components/SectionTitle';
import NoData from 'components/NoData';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ResultTable from './components/table';
import { IEvent, IEventAnalysis } from 'interfaces/analysis';
import { IChart } from './components/chart';
import { IRouterParams } from 'interfaces/project';
import { useParams } from 'react-router-dom';
import { getEventAnalysis } from 'services/analysis';
import styles from './index.module.scss';

interface IProps {
  eventInfo?: IEvent;
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  submitLoading: boolean;
  operateTrackCollection(trackEvent: boolean): void;
}

const Results = (props: IProps) => {
  const { trackEvents, allowEnableTrackEvents, submitLoading, operateTrackCollection } = props;
  const [data, saveData] = useState<unknown[]>([]);
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();
  const time = '2022-02-09 22:22:22';

  const labels = new Array(14).fill('0');
  const cdata = [
    {
      label: 'My First Dataset',
      data: new Array(14).fill(0).map(() => Math.random()),
    },
    {
      label: 'My First Dataset',
      data: new Array(14).fill(0).map(() => Math.random()),
    },
  ];
  useEffect(() => {
    getEventAnalysis<IEventAnalysis>(projectKey, environmentKey, toggleKey).then((res) => {
      if (res.success && res.data) {
        console.log(res.data);
        //saveData(res.data);
      }
    });
  }, [environmentKey, intl, projectKey, toggleKey]);

  return (
    <div className={styles.result}>
      <SectionTitle title={intl.formatMessage({ id: 'common.data.text' })} showTooltip={false} />
      <div className={styles.start}>
        {trackEvents && (
          <span className={styles['start-time']}>
            <FormattedMessage id="analysis.result.collect.time" />
            {time}
          </span>
        )}
        {!trackEvents ? (
          <Button
            primary
            loading={submitLoading}
            className={styles['start-btn']}
            disabled={!allowEnableTrackEvents}
            onClick={() => {
              operateTrackCollection(true);
            }}
          >
            <FormattedMessage id="analysis.result.collect.start" />
          </Button>
        ) : (
          <Button
            secondary
            loading={submitLoading}
            className={styles['start-btn']}
            onClick={() => {
              operateTrackCollection(false);
            }}
          >
            <FormattedMessage id="analysis.result.collect.stop" />
          </Button>
        )}
      </div>

      {data.length > 0 && (
        <div className={styles['result-content']}>
          <ResultTable />
        </div>
      )}

      <div className={styles['analysis-chart']}>
        <IChart labels={labels} datasets={cdata} />
      </div>

      <div className={styles['no-data']}>
        {allowEnableTrackEvents && (
          <div className={styles.tips}>
            <Icon customclass={styles['warning-circle']} type="warning-circle" />
            <FormattedMessage id="analysis.result.tip" />
          </div>
        )}
        {data.length === 0 && <NoData />}
      </div>
    </div>
  );
};

export default Results;
