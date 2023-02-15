import { Line } from 'react-chartjs-2';
import { Chart, Filler, Tooltip } from 'chart.js';
import { VariationColors, VariationOpacityColors } from 'constants/colors';

Chart.register(Filler);
Chart.register(Tooltip);

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
        interaction: {
          intersect: false,
          mode: 'index',
        },
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
            padding: 15,
            bodySpacing: 0,
            callbacks: {
              beforeBody: tooltipItems => {
                return tooltipItems[0].label;
              },
              title: function() {
                return '';
              },
              label: function() {
                return '';
              }
            }
          }
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
            borderWidth: 1.5,
            backgroundColor: VariationColors[index],
            borderColor: VariationColors[index],
            tension: 0.4,
            fill: {
              target: 'origin',
              above: VariationOpacityColors[index],
            }
          };
        }),
      }}
    />
  );
};
