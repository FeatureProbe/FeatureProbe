import { ChartData, ChartDataset, DefaultDataPoint } from 'chart.js';
import { VariationColors } from 'constants/colors';
import { IMetric, IValues } from 'interfaces/targeting';

export const createChartData = (
  metrics: IMetric[],
  summary: IValues[],
): ChartData<'line', DefaultDataPoint<'line'>, string> => {
  const labels: string[] = [];
  const dataArr: IValues[][] = [];
  let datasets: ChartDataset<'line', DefaultDataPoint<'line'>>[] = [];

  metrics.forEach((metric: IMetric) => {
    labels.push(metric.name);
    dataArr.push(metric.values);
  });

  datasets = summary?.map((item: IValues, index: number) => {
    const value = item.value;
    const result = dataArr.map((data: IValues[]) => {
      const index = data.findIndex((val: IValues) => val.value === value);
      if (index !== -1) {
        return data[index].count;
      }
      return null;
    });

    return {
      label: value,
      data: result,
      borderColor: VariationColors[index],
      borderWidth: 2,
      backgroundColor: VariationColors[index],
      pointRadius: 1,
      pointHoverRadius: 4,
      fill: false,
      tension: 0.4
    };
  });

  return { 
    labels,
    datasets,
  };
};
