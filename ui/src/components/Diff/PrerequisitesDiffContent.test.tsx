import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrerequisiteDiffContent from './PrerequisitesDiffContent';
import { IntlWrapper } from 'components/utils/wrapper';
import idiff from './diff';

const content_a = idiff(
  [
    {
      key: 'key 1',
      type: 'type 1',
      value: 'value 1'
    },
    {
      key: 'key 2',
      type: 'type 2',
      value: 'value 2'
    },
    {
      key: 'key 3',
      type: 'type 3',
      value: 'value 3'
    },
  ],
  [
    {
      key: 'key 2',
      type: 'type 2',
      value: 'value 2'
    },
    {
      key: 'key 3',
      type: 'type 3',
      value: 'value 3'
    },
    {
      key: 'key 4',
      type: 'type 4',
      value: 'value 4'
    },
  ]
);

const content_b = idiff(
  [
    {
      key: 'key 1',
      type: 'type 1',
      value: 'value 1'
    },
  ],
  [
    {
      key: 'key 1',
      type: 'type 1',
      value: 'value 2'
    },
  ]
);

it('DiffPrerequisites snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<PrerequisiteDiffContent content={content_a} />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    rerender(<PrerequisiteDiffContent content={content_b} />);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
