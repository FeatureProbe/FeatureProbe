import { Chart, TooltipModel } from 'chart.js';

const getOrCreateTooltip = (chart: Chart) => {
  let tooltipEl = chart?.canvas?.parentNode?.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(255, 255, 255, 0.95)';
    tooltipEl.style.borderRadius = '8px';
    tooltipEl.style.boxShadow = '0 -2px 4px 0 rgba(0,0,0,0.02), 0 2px 6px 6px rgba(0,0,0,0.02), 0 2px 6px 0 rgba(0,0,0,0.06)';
    tooltipEl.style.color = '#74788d';
    tooltipEl.style.opacity = '1';
    tooltipEl.style.width = '170px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';
    table.style.width = '100%';

    tooltipEl.appendChild(table);
    chart?.canvas?.parentNode?.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: { chart: Chart; tooltip: TooltipModel<'line'> }) => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title: string) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = '0';

      const th = document.createElement('th');
      th.style.borderWidth = '0';

      const titleDiv = document.createElement('div');
      const textName = document.createTextNode(title);
      titleDiv.appendChild(textName);

      const descDiv = document.createElement('div');
      const descText = document.createTextNode('total');
      descDiv.appendChild(descText);

      th.style.width = '100%';
      th.style.fontWeight = 'normal';
      th.style.color = '#212529';
      th.style.display = 'inline-flex';
      th.style.justifyContent = 'space-between';
      th.style.marginBottom = '8px';

      th.appendChild(titleDiv);
      th.appendChild(descDiv);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');

    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = '0';
      tr.style.width = '100%';

      const td = document.createElement('td');
      td.style.borderWidth = '0';

      const containerDiv = document.createElement('div');
      containerDiv.style.display = 'flex';
      containerDiv.style.width = '100%';
      containerDiv.style.justifyContent = 'space-between';
      containerDiv.style.alignItems = 'center';

      const colorDiv = document.createElement('div');
      // @ts-ignore type compatibility
      colorDiv.style.background = colors.backgroundColor;
      // @ts-ignore type compatibility
      colorDiv.style.borderColor = colors.borderColor;
      colorDiv.style.borderWidth = '2px';
      colorDiv.style.marginRight = '10px';
      colorDiv.style.height = '12px';
      colorDiv.style.width = '12px';
      colorDiv.style.borderRadius = '4px';

      const nameDiv = document.createElement('div');
      const splitData = body[0].split(':');

      nameDiv.style.maxWidth = '100px';
      nameDiv.style.overflow = 'hidden';
      nameDiv.style.textOverflow = 'ellipsis';
      nameDiv.style.whiteSpace = 'nowrap';
      nameDiv.style.color = '#74788d';
      const textName = document.createTextNode(splitData[0]);
      nameDiv.appendChild(textName);

      const countDiv = document.createElement('div');
      countDiv.style.flex = '1';
      countDiv.style.textAlign = 'right';
      countDiv.style.fontFamily = 'HelveticaNeue-Medium';
      countDiv.style.fontSize = '12px';
      countDiv.style.color = '#212529';
      const countText = document.createTextNode(splitData[1]);
      countDiv.appendChild(countText);

      containerDiv.appendChild(colorDiv);
      containerDiv.appendChild(nameDiv);
      containerDiv.appendChild(countDiv);

      td.appendChild(containerDiv);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    while (tableRoot?.firstChild) {
      tableRoot.firstChild.remove();
    }

    tableRoot?.appendChild(tableHead);
    tableRoot?.appendChild(tableBody);
  }

  const {
    offsetLeft: positionX,
    offsetTop: positionY,
  } = chart.canvas;

  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = positionX + tooltip.caretX + '0px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
