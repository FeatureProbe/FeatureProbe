import { IntlShape } from 'react-intl';
import { IOption } from 'interfaces/targeting';

export const VALUE_IN = 'is in';
export const VALUE_NOT_IN = 'is not in';

export const STRING_TYPE = 'string';
export const NUMBER_TYPE = 'number';
export const DATETIME_TYPE = 'datetime';
export const SEMVER_TYPE = 'semver';
export const SEGMENT_TYPE = 'segment';

export const attributeOptions: IOption[] = [
  { key: 'userId', text: 'userId', value: 'userId' },
];

export const getSubjectSegmentOptions = () => [
  { key: 'userId', text: 'userId', value: 'userId' },
];

export const getAttrOptions = (intl: IntlShape, type?:string) => {
  if (type === 'string') {
    return [
      { key: '1', text: intl.formatMessage({id: 'targeting.rule.condition.isoneof'}), value: 'is one of' },
      { key: '2', text: intl.formatMessage({id: 'targeting.rule.condition.notanyof'}), value: 'is not any of' },
      { key: '3', text: intl.formatMessage({id: 'targeting.rule.condition.startswith'}), value: 'starts with' },
      { key: '4', text: intl.formatMessage({id: 'targeting.rule.condition.notstartwith'}), value: 'does not start with' },
      { key: '5', text: intl.formatMessage({id: 'targeting.rule.condition.endswidth'}), value: 'ends with' },
      { key: '6', text: intl.formatMessage({id: 'targeting.rule.condition.notendwith'}), value: 'does not end with' },
      { key: '7', text: intl.formatMessage({id: 'targeting.rule.condition.contains'}), value: 'contains' },
      { key: '8', text: intl.formatMessage({id: 'targeting.rule.condition.notcontain'}), value: 'does not contain' },
      { key: '9', text: intl.formatMessage({id: 'targeting.rule.condition.matches'}), value: 'matches regex' },
      { key: '10', text: intl.formatMessage({id: 'targeting.rule.condition.notmatch'}), value: 'does not match regex' },
    ];
  } else if (type === 'segment') {
    return [
      { key: '1', text: intl.formatMessage({id: 'targeting.rule.subject.segment.in'}), value: 'is in' },
      { key: '2', text: intl.formatMessage({id: 'targeting.rule.subject.segment.notin'}), value: 'is not in' },
    ];
  } else if (type === 'number' || type === 'semver') {
    return [
      { key: '1', text: '=', value: '=' },
      { key: '2', text: '!=', value: '!=' },
      { key: '3', text: '<', value: '<' },
      { key: '4', text: '<=', value: '<=' },
      { key: '5', text: '>', value: '>' },
      { key: '6', text: '>=', value: '>=' },
    ];
  } else if (type === 'datetime') {
    return [
      { key: '1', text: intl.formatMessage({id: 'targeting.rule.subject.datetime.before'}), value: 'before' },
      { key: '2', text: intl.formatMessage({id: 'targeting.rule.subject.datetime.after'}), value: 'after' },
    ];
  }
};

export const timezoneOptions = () => {
  return [
    {key: 1, text: 'UTC +0', value: '+00:00'},
    {key: 2, text: 'UTC +1', value: '+01:00'},
    {key: 3, text: 'UTC +2', value: '+02:00'},
    {key: 4, text: 'UTC +3', value: '+03:00'},
    {key: 5, text: 'UTC +4', value: '+04:00'},
    {key: 6, text: 'UTC +5', value: '+05:00'},
    {key: 7, text: 'UTC +6', value: '+06:00'},
    {key: 8, text: 'UTC +7', value: '+07:00'},
    {key: 9, text: 'UTC +8', value: '+08:00'},
    {key: 10, text: 'UTC +9', value: '+09:00'},
    {key: 11, text: 'UTC +10', value: '+10:00'},
    {key: 12, text: 'UTC +11', value: '+11:00'},
    {key: 13, text: 'UTC +12', value: '+12:00'},
    {key: 14, text: 'UTC -12', value: '-12:00'},
    {key: 15, text: 'UTC -11', value: '-11:00'},
    {key: 16, text: 'UTC -10', value: '-10:00'},
    {key: 17, text: 'UTC -9', value: '-09:00'},
    {key: 18, text: 'UTC -8', value: '-08:00'},
    {key: 19, text: 'UTC -7', value: '-07:00'},
    {key: 20, text: 'UTC -6', value: '-06:00'},
    {key: 21, text: 'UTC -5', value: '-05:00'},
    {key: 22, text: 'UTC -4', value: '-04:00'},
    {key: 23, text: 'UTC -3', value: '-03:00'},
    {key: 24, text: 'UTC -2', value: '-02:00'},
    {key: 25, text: 'UTC -1', value: '-01:00'},
  ];
};
