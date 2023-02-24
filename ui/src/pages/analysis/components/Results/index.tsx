import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import SectionTitle from 'components/SectionTitle';
import NoData from 'components/NoData';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ResultTable from './components/table';
import { IChart } from './components/chart';
import { getEventAnalysis, operateCollection } from 'services/analysis';
import { IChartData, IEvent, IEventAnalysis, IDistribution, ITableData, IAnalysisItem } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { ITarget } from 'interfaces/targeting';
import TextLimit from 'components/TextLimit';
import { CUSTOM, CONVERSION, CLICK, PAGE_VIEW, NUMERIC } from '../../constants';

import styles from './index.module.scss';

interface IProps {
  eventInfo?: IEvent;
  targeting?: ITarget;
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  submitLoading: boolean;
  initTargeting(): void;
  saveSubmitLoading: React.Dispatch<React.SetStateAction<boolean>>;
  operateTrackCollection(trackEvent: boolean): void;
}

const Results = (props: IProps) => {
  const { trackEvents, allowEnableTrackEvents, submitLoading, targeting, eventInfo, initTargeting, saveSubmitLoading } = props;
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ isHaveData, saveHaveData ] = useState<boolean>(false);
  const [ startTime, saveStartTime ] = useState<string>('');
  const [ endTime, saveEndTime ] = useState<string>('');
  const [ result, saveResult ] = useState<IAnalysisItem>();
  const [ chartLabels, saveChartLabels ] = useState<unknown[]>([]);
  const [ chartData, saveChartData ] = useState<IChartData[]>();
  const [ tableData, saveTableData ] = useState<ITableData[]>();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  const metricTypeText = useMemo(() => {
    return new Map([
      [CUSTOM, intl.formatMessage({id: 'analysis.event.custom'})],
      [CONVERSION, `${intl.formatMessage({id: 'analysis.event.custom'})} - ${intl.formatMessage({id: 'analysis.event.conversion'})}`],
      [NUMERIC, `${intl.formatMessage({id: 'analysis.event.custom'})} - ${intl.formatMessage({id: 'analysis.event.numeric'})}`],
      [CLICK, intl.formatMessage({id: 'analysis.event.click'})],
      [PAGE_VIEW, intl.formatMessage({id: 'analysis.event.pageview'})],
    ]);
  }, [intl]);

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

  const getEventResult = useCallback(() => {
    getEventAnalysis<IEventAnalysis>(projectKey, environmentKey, toggleKey).then(res => {
      const { success, data } = res;
      if (success && data) {
        saveStartTime(data.start);
        saveEndTime(data.end);
        saveResult(data.data);
      }
    });
  }, [environmentKey, projectKey, toggleKey]);

  useEffect(() => {
    getEventResult();
  }, [getEventResult]);

  const operateTrackCollection = useCallback(trackEvents => {
    saveSubmitLoading(true);
    operateCollection(projectKey, environmentKey, toggleKey, {
      trackAccessEvents: trackEvents
    }).then(res => {
      if (res.success) {
        initTargeting();
        getEventResult();
      }
      saveSubmitLoading(false);
    });
  }, [saveSubmitLoading, projectKey, environmentKey, toggleKey, initTargeting, getEventResult]);

  return (
    <div className={styles.result}>
      <SectionTitle title={intl.formatMessage({ id: 'common.data.text' })} showTooltip={false} />
      <div className={styles.start}>
        <span className={styles['start-time']}>
          {
            startTime && (
              <>
                <FormattedMessage id="analysis.result.collect.time" />
                {dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')}
              </>
            )
          }
          {
            endTime && (
              <>
                <span className={styles.divider}>-</span> 
                {
                  trackEvents 
                    ? <FormattedMessage id='analysis.result.collect.end' /> 
                    : <span>{dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                }
              </>
            )
          }
        </span>
        {
          !trackEvents ? (
            <Button
              primary
              size='mini'
              loading={submitLoading}
              className={styles['start-btn']}
              disabled={!allowEnableTrackEvents}
              onClick={() => {
                if (isHaveData) {
                  saveOpen(true);
                } else {
                  operateTrackCollection(true);
                }
              }}
            >
              <FormattedMessage id="analysis.result.collect.start" />
            </Button>
          ) : (
            <Button
              secondary
              size='mini'
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
        !eventInfo && (
          <div className={styles.tips}>
            <Icon customclass={styles['warning-circle']} type="warning-circle" />
            <FormattedMessage id="analysis.result.tip" />
          </div>
        )
      }

      {
        isHaveData ? (
          <div className={styles['result-content']}>
            <div className={styles['table-header']}>
              <span className={styles['metric-name']}>
                <TextLimit text={eventInfo?.name ?? ''} maxLength={20} />
                <span>:</span>
              </span>
              <span className={styles['type']}>{metricTypeText.get(eventInfo?.type ?? '')}</span>
            </div>
            <ResultTable 
              data={tableData}
              eventInfo={eventInfo}
            />
          </div>
        ) : (
          <div className={styles['no-data']}>
            <NoData />
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

      <Modal
        open={open}
        width={308}
        handleCancel={() => {
          saveOpen(false);
        }}
        handleConfirm={() => {
          operateTrackCollection(true);
          saveOpen(false);
        }}
      >
        <div>
          <div className={styles['modal-header']}>
            <Icon customclass={styles['modal-warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='analysis.result.collect.tip' />
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Results;
