import { FormattedMessage } from 'react-intl';
import { CUSTOM, CONVERSION, CLICK, PAGE_VIEW, AVERAGE, POSITIVE, NEGATIVE, SIMPLE, EXACT, SUBSTRING, REGULAR, COUNT, SUM } from '../constants';

const STYLE = {color: '#74788d', marginLeft: '4px'};

export function getMetricTypeOptions() {
  return [
    { 
      key: CONVERSION, 
      value: CONVERSION, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.conversion' />
          <span style={STYLE}>
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
          <span style={STYLE}>
            <FormattedMessage id='analysis.event.count.desc' />
          </span>
        </span>
      )
    },
    { 
      key: AVERAGE, 
      value: AVERAGE, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.average' />
          <span style={STYLE}>
            <FormattedMessage id='analysis.event.average.desc' />
          </span>
        </span>
      )
    },
    { 
      key: SUM, 
      value: SUM, 
      text: (
        <span>
          <FormattedMessage id='analysis.event.sum' />
          <span style={STYLE}>
            <FormattedMessage id='analysis.event.sum.desc' />
          </span>
        </span>
      )
    },
  ];
};

export function getUrlMatchOptions() {
  return [
    { 
      key: SIMPLE, 
      value: SIMPLE, 
      text: <FormattedMessage id='analysis.event.target.url.matching.simple' />
    },
    { 
      key: EXACT, 
      value: EXACT, 
      text: <FormattedMessage id='analysis.event.target.url.matching.exact' />
    },
    { 
      key: SUBSTRING, 
      value: SUBSTRING, 
      text: <FormattedMessage id='analysis.event.target.url.matching.substring' />
    },
    { 
      key: REGULAR, 
      value: REGULAR, 
      text: <FormattedMessage id='analysis.event.target.url.matching.regex' />
    },
  ];
};

export function getWinCriteriaOptions() {
  return [
    { 
      key: POSITIVE, 
      value: POSITIVE, 
      text: <FormattedMessage id='analysis.metric.target.win.criteria.greater' />
    },
    { 
      key: NEGATIVE, 
      value: NEGATIVE, 
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