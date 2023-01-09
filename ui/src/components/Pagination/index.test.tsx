import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Pagination from '.';
import sleep from 'utils/sleep';
import { IntlWrapper } from 'components/utils/wrapper';

it('Pagination snapshot', (done) => {
  (async () => {
    const { asFragment } = render(
      <Pagination 
        handlePageChange={jest.fn()}
        pagination={{
          pageIndex: 0,
          totalPages: 10
        }}
      />
    , { wrapper: IntlWrapper});
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('Pagination hideTotal', (done) => {
  (async () => {
    render(
      <Pagination 
        handlePageChange={jest.fn()}
        hideTotal={true}
        total={100}
        pagination={{
          pageIndex: 0,
          totalPages: 10
        }}
      />
    , { wrapper: IntlWrapper});

    const ele = document.getElementsByClassName('total-count')[0];
    expect(ele).toBeUndefined();

    done();
  })();
});

test('Pagination Click Test', (done) => {
  (async () => {
    const mockHandleChange = jest.fn();

    render(
      <Pagination 
        handlePageChange={mockHandleChange}
        hideTotal={false}
        total={100}
        pagination={{
          pageIndex: 0,
          totalPages: 10
        }}
      />
    , { wrapper: IntlWrapper});

    // Click next page icon
    await userEvent.click(document.getElementsByClassName('icon-angle-right')[0]);
    expect(mockHandleChange).toBeCalled();

    await sleep(1000);

    // Click page 10
    await userEvent.click(screen.getByText('10'));
    expect(mockHandleChange).toBeCalled();

    done();
  })();
});
