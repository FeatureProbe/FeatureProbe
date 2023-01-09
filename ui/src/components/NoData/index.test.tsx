import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoData from '.';
import { IntlWrapper } from 'components/utils/wrapper';

it('NoData snapshot', (done) => {
  (async () => {
    const { asFragment } = render(
      <NoData></NoData>
    , { wrapper: IntlWrapper});
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('NoData custom text', (done) => {
  (async () => {
    render(
      <NoData text='No Data Test'></NoData>
    , { wrapper: IntlWrapper});

    screen.getByText('No Data Test');
    expect(screen.getByText('No Data Test')).not.toBeNull();
    done();
  })();
});
