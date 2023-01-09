import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Modal from '.';
import { IntlWrapper } from 'components/utils/wrapper';

it('Modal snapshot', (done) => {
  (async () => {
    const { baseElement, rerender } = render(
      <Modal open={true}>
        <div>modal content</div>
      </Modal>,
      {
        wrapper: IntlWrapper,
      }
    );
    expect(baseElement).toMatchSnapshot();

    rerender(
      <Modal open={true} footer={<div>footer</div>}>
        <div>modal content</div>
      </Modal>
    );
    done();
  })();
});

test('click Modal button', (done) => {
  (async () => {
    const mockHandleCancel = jest.fn();
    const mockHandleConfirm = jest.fn();
    render(
      <Modal open={true} handleCancel={mockHandleCancel} handleConfirm={mockHandleConfirm}>
        <div>modal content</div>
      </Modal>,
      {
        wrapper: IntlWrapper,
      }
    );

    await userEvent.click(screen.getByText('Cancel'));
    await userEvent.click(screen.getByText('Confirm'));

    expect(mockHandleCancel).toBeCalled();
    expect(mockHandleConfirm).toBeCalled();

    done();
  })();
});
