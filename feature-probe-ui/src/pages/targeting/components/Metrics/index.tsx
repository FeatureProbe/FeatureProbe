import { useEffect, useMemo, useCallback, useState, SyntheticEvent, useRef } from 'react';
import { Select, DropdownProps } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
  Chart,
} from 'chart.js';
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import { VariationColors } from 'constants/colors';
import { createChartOptions } from './chartOption';
import { createChartData } from './chartData';
import { getOption } from './constants';
import { IRouterParams } from 'interfaces/project';
import { IMetric, IValues, IMetricContent } from 'interfaces/targeting';
import { getMetrics } from 'services/toggle';

import styles from './index.module.scss';

const Metrics = () => {
  const [ metrics, setMetric ] = useState<IMetric[]>([]);
  const [ summary, setSummary ] = useState<IValues[]>([]);
  const [ filterValue, setFilterValue ] = useState<string>('24');
  const [ fitlerType, setFilterType ] = useState<string>('name');
  const [ total, setTotal ] = useState<number>(0);
  const [ isAccess, saveIsAccess ] = useState<boolean>(false);
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();
  const history = useHistory();
  const timer: { current: NodeJS.Timeout | null } = useRef(null);

  const initMetrics = useCallback(() => {
    getMetrics<IMetricContent>(projectKey, environmentKey, toggleKey, {
      lastHours: filterValue,
      metricType: fitlerType.toUpperCase(),
    }).then(res => {
      saveIsLoading(false);
      const { data, success } = res;
      if (success && data) {
        setMetric(data.metrics || []);
        setSummary(data.summary || []);
        saveIsAccess(data.isAccess);

        let count = 0;
        data.summary?.forEach((item: IValues) => {
          count += item.count;
        });
        setTotal(count);
      } else {
        message.error(res.message || intl.formatMessage({id: 'targeting.metrics.error.text'}));
      }
    });
  }, [intl, projectKey, environmentKey, toggleKey, filterValue, fitlerType]);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    initMetrics();
    timer.current = setInterval(initMetrics, 5000);
    
    return () => {
      clearInterval(timer.current as NodeJS.Timeout);
    };
  }, [initMetrics, filterValue]);

  const chartOptions = useMemo(() => {
    return createChartOptions(metrics, projectKey, environmentKey, toggleKey, intl);
  }, [metrics, projectKey, environmentKey, toggleKey, intl]);

  const chartData = useMemo(() => {
    return createChartData(metrics, summary);
  }, [metrics, summary]);

  const handleSelectChange = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    setFilterValue(detail.value as string || '24');
  }, []);

  const handleGotoSDK = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/get-started`);
  }, [history, projectKey, environmentKey, toggleKey]);

  const menuNameCls = classNames({
    [styles['menu-item-selected']]: fitlerType === 'name',
  });

  const menuValueCls = classNames({
    [styles['menu-item-selected']]: fitlerType === 'value',
  });

	return (
		<div className={styles.metrics}>
      {
        isLoading ? <Loading /> : (
          <>
            <div className={styles.title}>
              <div className={styles['title-text']}>
                <FormattedMessage id='common.evaluations.text' />
              </div>
              <div className={styles.operations}>
                <div className={styles.menus}>
                  <span className={`${styles['menu-item']} ${menuNameCls}`} onClick={() => { setFilterType('name'); }}>
                    <FormattedMessage id='common.name.text' />
                  </span>
                  <span className={`${styles['menu-item']} ${menuValueCls}`} onClick={() => { setFilterType('value'); }}>
                    <FormattedMessage id='common.value.uppercase.text' />
                  </span>
                </div>
                <Select
                  floating
                  value={filterValue}
                  placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})}
                  className={styles['title-select']}
                  options={getOption(intl)}
                  onChange={handleSelectChange}
                  icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                />
              </div>
            </div>
            {
              isAccess ? (
                <div className={styles.content}>
                  <div className={styles.variations}>
                    <div className={styles['table-header']}>
                      <div>
                        {
                          intl.formatMessage(
                            {id: 'targeting.variations.evaluations.text'}, 
                            {
                              type: fitlerType === 'name' 
                                ? intl.formatMessage({id: 'common.name.text'}) 
                                : intl.formatMessage({id: 'common.value.uppercase.text'}) 
                            }
                          )
                        }
                      </div>
                      { 
                        total !== 0 && <div className={styles.total}>
                          { total }
                        </div> 
                      }
                    </div>
                    <div className={styles['table-content']}>
                      {
                        summary?.map((item: IValues, index: number) => {
                          return (
                            <div className={styles['variation-name']}>
                              <span style={{ background: VariationColors[index % 24] }} className={styles['variation-name-color']}></span>
                              <span className={`${styles['variation-name-text']} ${item.deleted && styles['variation-name-deleted']}`}>
                                { item.value }
                              </span>
                              <span className={`${styles['count']} ${item.deleted && styles['variation-deleted']}`}>
                                { item.count }
                              </span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  <div className={styles.chart}>
                    <Line
                      height={0}
                      options={chartOptions}
                      data={chartData}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles['no-data']}>
                  <div>
                    <img className={styles['no-data-image']} src={require('images/no-data.png')} alt='no-data' />
                  </div>
                  <div className={styles['no-data-text']}>
                    <FormattedMessage id='targeting.metrics.no.data.text' />
                  </div>
                  <div className={styles['no-data-text']}>
                    <span className={styles['no-data-link']} onClick={handleGotoSDK}>
                      <FormattedMessage id='targeting.metrics.link.sdk.text' />
                    </span>
                  </div>
                </div>
              )
            }
          </>
        )
      }
		</div>
	);
};

export default Metrics;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  annotationPlugin,
  {
    id: Date.now().toString(),
    afterDraw: (chart: Chart) => {
      // @ts-ignore null compatibility
      if (chart.tooltip._active && chart.tooltip._active.length) {
        // @ts-ignore null compatibility
        const activePoint = chart.tooltip._active[0];
        const ctx = chart.ctx;
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ced4da';
        ctx.stroke();
        ctx.restore();
      }
    }
  }
);
