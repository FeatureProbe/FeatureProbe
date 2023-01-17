import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RulesDiffContent } from './RulesDiffContent';
import { IntlWrapper } from 'components/utils/wrapper';
import idiff from './diff';

const content_a = idiff(
  [
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is not any of',
          objects: ['aaa', '222'],
        },
        {
          type: 'number',
          subject: 'num',
          predicate: '=',
          objects: ['222'],
        },
        {
          type: 'datetime',
          subject: 'time',
          predicate: 'before',
          objects: ['2023-01-10T10:14:06+08:00'],
        },
        {
          type: 'semver',
          subject: 'ver',
          predicate: '!=',
          objects: ['0.0.1'],
        },
        {
          type: 'segment',
          predicate: 'is not in',
          objects: ['_cn'],
        },
      ],
      name: 'Rule 1',
      serve: {
        select: 0,
      },
    },
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule2',
      serve: {
        split: [10000, 0],
      },
    },
  ],
  [
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is not any of',
          objects: ['222'],
        },
        {
          type: 'number',
          subject: 'num',
          predicate: '=',
          objects: ['222', '333'],
        },
        {
          type: 'semver',
          subject: 'ver',
          predicate: '!=',
          objects: ['0.0.1'],
        },
        {
          type: 'segment',
          predicate: 'is not in',
          objects: ['_cn'],
        },
        {
          type: 'string',
          subject: 'str2',
          predicate: 'is not any of',
          objects: ['333'],
        },
      ],
      name: 'Rule 1M',
      serve: {
        split: [5000, 5000],
      },
    },
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule2',
      serve: {
        select: 0,
      },
    },
  ]
);

const content_b = idiff(
  [
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule2',
      serve: {
        split: [10000, 0],
      },
    },
  ],
  [
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule2',
      serve: {
        split: [10000, 0],
      },
    },
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule3',
      serve: {
        split: [10000, 0],
      },
    },
  ]
);

const content_c = idiff(
  [
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule2',
      serve: {
        split: [10000, 0],
      },
    },
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule3',
      serve: {
        split: [10000, 0],
      },
    },
  ],
  [
    {
      conditions: [
        {
          type: 'string',
          subject: 'str',
          predicate: 'is one of',
          objects: ['ioio'],
        },
      ],
      name: 'Rule2',
      serve: {
        split: [10000, 0],
      },
    },
  ]
);

it('RulesDiffContent snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<RulesDiffContent content={content_a} />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    rerender(<RulesDiffContent content={content_b} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<RulesDiffContent content={content_c} />);
    expect(asFragment()).toMatchSnapshot();


    done();
  })();
});
