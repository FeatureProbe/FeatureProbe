import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PopupConFirm from '.';
import { IntlWrapper } from 'components/utils/wrapper';

it('PopupConFirm snapshot', (done) => {
  (async () => {
    const { baseElement } = render(
      <PopupConFirm open={true} text={'popup confirm text'} handleCancel={jest.fn()} handleConfirm={jest.fn()}>
        <span>this is test text.</span>
      </PopupConFirm>,
      {
        wrapper: IntlWrapper,
      }
    );
    expect(baseElement).toMatchSnapshot();
    done();
  })();
});

test('click PopupConFirm button', (done) => {
  (async () => {
    const mockHandleCancel = jest.fn();
    const mockHandleConfirm = jest.fn();
    render(
      <PopupConFirm
        open={true}
        text={'popup confirm text'}
        handleCancel={mockHandleCancel}
        handleConfirm={mockHandleConfirm}
      >
        <span>this is test text.</span>
      </PopupConFirm>,
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
