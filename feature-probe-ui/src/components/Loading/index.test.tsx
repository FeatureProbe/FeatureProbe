import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from '.';
import { IntlWrapper } from 'components/utils/wrapper';

it('Loading snapshot', (done) => {
  (async () => {
    const { asFragment } = render(
      <Loading></Loading>
    , { wrapper: IntlWrapper});
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});
