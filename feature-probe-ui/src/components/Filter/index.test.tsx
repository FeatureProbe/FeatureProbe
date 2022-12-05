import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Filter from '.';
import sleep from 'utils/sleep';
import { IntlWrapper } from 'components/utils/wrapper';

it('Filter snapshot', (done) => {
  (async () => {
    const { asFragment } = render(
      <Filter handleConfirm={jest.fn()} handleClear={jest.fn()} selected>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </Filter>
    );
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('Filter icon click snapshot', (done) => {
  (async () => {
    const { baseElement } = render(
      <Filter handleConfirm={jest.fn()} handleClear={jest.fn()} selected={true}>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </Filter>
    , { wrapper: IntlWrapper});

    const ele = document.getElementsByClassName('icon-filter')[0];
    await userEvent.click(ele);

    expect(baseElement).toMatchSnapshot();
    done();
  })();
});

test('Filter Confirm Button click snapshot', (done) => {
  (async () => {
    const mockHandleCancel = jest.fn();
    const mockHandleConfirm = jest.fn();

    const { baseElement } = render(
      <Filter handleConfirm={mockHandleConfirm} handleClear={mockHandleCancel} selected={true}>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </Filter>
    , { wrapper: IntlWrapper});

    const ele = document.getElementsByClassName('icon-filter')[0];
    await userEvent.click(ele);
    expect(baseElement).toMatchSnapshot();

    await sleep(1000);

    await userEvent.click(screen.getByText('Clear'));
    expect(mockHandleCancel).toBeCalled();

    await userEvent.click(screen.getByText('Confirm'));
    expect(mockHandleConfirm).toBeCalled();

    expect(baseElement).toMatchSnapshot();

    done();
  })();
});
