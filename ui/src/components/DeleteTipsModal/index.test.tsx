import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DeleteTipsModal from '.';
import { IntlWrapper } from 'components/utils/wrapper';

it('DeleteTipsModal snapshot', (done) => {
  (async () => {
    const { baseElement, rerender } = render(
      <DeleteTipsModal
        open={true}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        content={'test content'}
        title={'test title'}
      />,
      {
        wrapper: IntlWrapper,
      }
    );
    expect(baseElement).toMatchSnapshot();

    rerender(
      <DeleteTipsModal
        open={true}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        content={'test content'}
        title={'test title'}
        renderFooter={(nodes) => nodes}
      />
    );
    expect(baseElement).toMatchSnapshot();

    done();
  })();
});

it('DeleteTipsModal clcik', (done) => {
  (async () => {
    const mockOnCancel = jest.fn();
    const mockOnConfirm = jest.fn();
    render(
      <DeleteTipsModal
        open={true}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        content={'test content'}
        title={'test title'}
      />,
      {
        wrapper: IntlWrapper,
      }
    );
    
    await userEvent.click(screen.getByText('Confirm'));
    await userEvent.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toBeCalled();
    expect(mockOnConfirm).toBeCalled();

    done();
  })();
});
