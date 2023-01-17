import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiffSection from './DiffSection';
import { IntlWrapper } from 'components/utils/wrapper';
import { ReactNode } from 'react';

it('DiffSection snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(
      <DiffSection
        title={'Test'}
        before={['a']}
        after={['a', 'b']}
        diffKey={'Test'}
        renderContent={function (): ReactNode {
          return <div>test</div>;
        }}
      />,
      {
        wrapper: IntlWrapper,
      }
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <DiffSection
        title={'Test'}
        before={['a']}
        after={['a']}
        beforeDiff={() => {
            return [['a'], ['a']];
        }}
        diffKey={'status'}
        renderContent={function (): ReactNode {
          return <div>test</div>;
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
