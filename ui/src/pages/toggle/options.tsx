import { FormattedMessage } from 'react-intl';

export const evaluationOptions = () => {
  return [
    { 
      key: 'in last 7 days', 
      value: 'IN_WEEK_VISITED', 
      text: <FormattedMessage id='toggles.filter.evaluated.last.seven.days' />
    },
    { 
      key: 'not in last 7 days', 
      value: 'OUT_WEEK_VISITED', 
      text: <FormattedMessage id='toggles.filter.evaluated.not.last.seven.days' />
    },
    { 
      key: 'none', 
      value: 'NOT_VISITED', 
      text: <FormattedMessage id='toggles.filter.evaluated.never' />
    },
  ];
};

export const statusOptions = () => {
  return [
    { 
      key: 'enabled', 
      value: false, 
      text: <FormattedMessage id='common.enabled.text' />
    },
    { 
      key: 'disabled', 
      value: true, 
      text: <FormattedMessage id='common.disabled.text' />
    },
  ];
};

export const permanentOptions = () => {
  return [
    { 
      key: 'yes', 
      value: true, 
      text: <FormattedMessage id='common.yes.text' />
    },
    { 
      key: 'no', 
      value: false, 
      text: <FormattedMessage id='common.no.text' />
    },
  ];
};
