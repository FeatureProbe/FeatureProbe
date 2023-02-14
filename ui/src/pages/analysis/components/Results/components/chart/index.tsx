import { VariationColors } from 'constants/colors';
import { Line } from 'react-chartjs-2';

interface IChartProps {
  labels: unknown[];
  datasets: {
    label: string;
    data: unknown[];
  }[];
}

export const IChart: React.FC<IChartProps> = (props) => {
  const { labels, datasets } = props;

  return (
    <Line
      height="64"
      options={{
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              generateLabels: function (chart: any) {
                return datasets.map((item: { label: string }, index: number) => {
                  return {
                    text: item.label,
                    fillStyle: chart._metasets[index].visible ? VariationColors[index] : VariationColors[index] + '33',
                    strokeStyle: chart._metasets[index].visible
                      ? VariationColors[index]
                      : VariationColors[index] + '33',
                    fontColor: chart._metasets[index].visible ? '#000' : '#00000033',
                    datasetIndex: index,
                    borderRadius: 2,
                  };
                });
              },
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        elements: {
          point: {
            radius: 0
          },
        },
        transitions: {
          show: {
            animation: {
              duration: 0,
            },
          },
          hide: {
            animation: {
              duration: 0,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: 'rgba(0, 0, 0, 0)',
              stepSize: 0.2,
            },

            grid: {
              tickColor: 'rgba(0, 0, 0, 0)',
              borderDash: [3, 3],
              drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      }}
      data={{
        labels: labels,
        datasets: datasets.map((item, index) => {
          return {
            ...item,
            backgroundColor: VariationColors[index],
            borderColor: VariationColors[index],
            cubicInterpolationMode: 'monotone',
            pointHitRadius: 0
          };
        }),
      }}
    />
  );
};
