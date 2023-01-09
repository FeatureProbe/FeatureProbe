import { IntlShape } from 'react-intl';

export const getOption = (intl: IntlShape) => {
  return [
    { key: '24', value: '24', text: intl.formatMessage({id: 'targeting.metrics.option.one.day'}) },
    { key: '168', value: '168', text: intl.formatMessage({id: 'targeting.metrics.option.seven.days'}) },
  ];
};