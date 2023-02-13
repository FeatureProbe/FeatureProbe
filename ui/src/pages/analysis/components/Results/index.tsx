import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import SectionTitle from 'components/SectionTitle';
import NoData from 'components/NoData';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ResultTable from './components/table';
import { IChart } from './components/chart';
import { getEventAnalysis } from 'services/analysis';
import { IChartData, IEvent, IEventAnalysis, IDistribution, ITableData, IAnalysisItem } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { ITarget } from 'interfaces/targeting';

import styles from './index.module.scss';

interface IProps {
  eventInfo?: IEvent;
  targeting?: ITarget;
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  submitLoading: boolean;
  operateTrackCollection(trackEvent: boolean): void;
}

const Results = (props: IProps) => {
  const { trackEvents, allowEnableTrackEvents, submitLoading, targeting, operateTrackCollection } = props;
  const [ isHaveData, saveHaveData ] = useState<boolean>(false);
  const [ startTime, saveStartTime ] = useState<string>('');
  const [ endTime, saveEndTime ] = useState<string>('');
  const [ result, saveResult ] = useState<IAnalysisItem>();
  const [ chartLabels, saveChartLabels ] = useState<unknown[]>([]);
  const [ chartData, saveChartData ] = useState<IChartData[]>();
  const [ tableData, saveTableData ] = useState<ITableData[]>();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

   useEffect(() => {
    if (!targeting?.variations || !result) {
      return;
    };

    const tableData: ITableData[] = [];
    const chartData: IChartData[] = [];

    if (JSON.stringify(result) !== '{}') {
      saveHaveData(true);
    } else {
      saveHaveData(false);
    }

    let labels: unknown[] = [];

    for (const item in result) {
      chartData.push({
        label: targeting?.variations[Number(item)].name || '',
        data: result[item].distributionChart.map((val: IDistribution) => {
          return val.y;
        })
      });

      tableData.push({
        name: targeting?.variations[Number(item)].name || '',
        mean: result[item].mean,
        winningPercentage: result[item].winningPercentage,
        credibleInterval: result[item].credibleInterval,
      });

      labels = result[item].distributionChart.map((val: IDistribution) => {
        return val.x;
      });
  
      saveChartData(chartData);
      saveTableData(tableData);
      saveChartLabels(labels);
    }
    
  }, [result, targeting?.variations]);

  useEffect(() => {
    getEventAnalysis<IEventAnalysis>(projectKey, environmentKey, toggleKey).then(res => {
      const { success, data } = res;
      if (success && data) {
        saveStartTime(data.start);
        saveEndTime(data.end);
        saveResult(data.data);
      }
    });
  }, [environmentKey, projectKey, toggleKey]);

  return (
    <div className={styles.result}>
      <SectionTitle title={intl.formatMessage({ id: 'common.data.text' })} showTooltip={false} />
      <div className={styles.start}>
        <span className={styles['start-time']}>
          <FormattedMessage id="analysis.result.collect.time" />
          {dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')}
           - 
          {
            trackEvents 
              ? <FormattedMessage id='analysis.result.collect.end' /> 
              : <span>{dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
        </span>
        {
          !trackEvents ? (
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
          )
        }
      </div>

      {
        allowEnableTrackEvents && (
          <div className={styles.tips}>
            <Icon customclass={styles['warning-circle']} type="warning-circle" />
            <FormattedMessage id="analysis.result.tip" />
          </div>
        )
      }

      {
        isHaveData && (
          <div className={styles['result-content']}>
            <ResultTable data={tableData} />
          </div>
        )
      }

      {
        isHaveData && chartData && (
          <div className={styles['analysis-chart']}>
            <IChart labels={chartLabels} datasets={chartData} />
          </div>
        )
      }

      {
        !isHaveData && (
          <div className={styles['no-data']}>
            <NoData />
          </div>
        )
      }
    </div>
  );
};

export default Results;
