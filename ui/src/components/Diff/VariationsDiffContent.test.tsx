import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariationsDiffContent from './VariationsDiffContent';
import { IntlWrapper } from 'components/utils/wrapper';
import idiff from './diff';

const content_a = idiff(
  [
    {
      name: 'name 1',
      value: 'value 1',
      description: 'description 1'
    },
    {
      name: 'name 2',
      value: 'value 2',
      description: 'description 2'
    },
    {
      name: 'name 3',
      value: 'value 3',
      description: 'description 3'
    },
  ],
  [
    {
      name: 'name 2',
      value: 'value 2',
      description: 'description 2'
    },
    {
      name: 'name 3',
      value: 'value 3',
      description: 'description 3 modify'
    },
    {
      name: 'name 4',
      value: 'value 4',
      description: 'description 4'
    },
  ]
);

const content_b = idiff(
  [
    {
      name: 'name 1',
      value: 'value 1',
      description: 'description 1'
    }
  ],
  [
    {
      nameErr: 'name 2',
      valueErr: 'value 2',
      descriptionErr: 'description 2'
    },
  ]
);

it('DiffVariations snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<VariationsDiffContent content={content_a} />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    rerender(<VariationsDiffContent content={content_b} />);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
