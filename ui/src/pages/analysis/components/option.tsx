import { FormattedMessage } from 'react-intl';
import { CUSTOM, CONVERSION, CLICK, PAGE_VIEW, COUNT, DURATION, REVENUE } from '../constants';

const COLOR_CSS = {color: '#74788d'};

export function getMetricTypeOptions() {
  return [
    { 
      key: CONVERSION, 
      value: CONVERSION, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.conversion' />
          <span style={COLOR_CSS}>
            <FormattedMessage id='analysis.event.conversion.desc' />
          </span>
        </span>
      )
    },
    { 
      key: COUNT, 
      value: COUNT, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.count' />
          <span style={COLOR_CSS}>
            <FormattedMessage id='analysis.event.count.desc' />
          </span>
        </span>
      )
    },
    { 
      key: DURATION, 
      value: DURATION, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.duration' />
          <span style={COLOR_CSS}>
            <FormattedMessage id='analysis.event.duration.desc' />
          </span>
        </span>
      )
    },
    { 
      key: REVENUE, 
      value: REVENUE, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.revenue' />
          <span style={COLOR_CSS}>
            <FormattedMessage id='analysis.event.revenue.desc' />
          </span>
        </span>
      )
    },
  ];
};

export function getUrlMatchOptions() {
  return [
    { 
      key: 'simple', 
      value: 'SIMPLE', 
      text: <FormattedMessage id='analysis.event.target.url.matching.simple' />
    },
    { 
      key: 'exact', 
      value: 'EXACT', 
      text: <FormattedMessage id='analysis.event.target.url.matching.exact' />
    },
    { 
      key: 'substring', 
      value: 'SUBSTRING', 
      text: <FormattedMessage id='analysis.event.target.url.matching.substring' />
    },
    { 
      key: 'regex', 
      value: 'REGULAR', 
      text: <FormattedMessage id='analysis.event.target.url.matching.regex' />
    },
  ];
};

export function getWinCriteriaOptions() {
  return [
    { 
      key: 'greater', 
      value: 'POSITIVE', 
      text: <FormattedMessage id='analysis.metric.target.win.criteria.greater' />
    },
    { 
      key: 'lower', 
      value: 'NEGATIVE', 
      text: <FormattedMessage id='analysis.metric.target.win.criteria.lower' />
    },
  ];
};

export function getEventTypeOptions() {
  return [
    { 
      key: CUSTOM, 
      value: CUSTOM, 
      text: <FormattedMessage id='analysis.event.custom' />
    },
    { 
      key: PAGE_VIEW, 
      value: PAGE_VIEW, 
      text: <FormattedMessage id='analysis.event.pageview' />
    },
    { 
      key: CLICK, 
      value: CLICK, 
      text: <FormattedMessage id='analysis.event.click' />
    },
  ];
};

export function getSimpleEventTypeOptions() {
  return [
    { 
      key: CUSTOM, 
      value: CUSTOM, 
      text: <FormattedMessage id='analysis.event.custom' />
    },
  ];
};