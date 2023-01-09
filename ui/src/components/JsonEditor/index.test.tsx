import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { DOMRect } from '../utils/domRect';
import JsonEditor from '.';

Range.prototype.getBoundingClientRect = jest.fn().mockReturnValue(new DOMRect(0, 0, 0, 0));
Range.prototype.getClientRects = jest.fn().mockReturnValue(new Set([new DOMRect(0, 0, 0, 0)]));
Element.prototype.getClientRects = jest.fn().mockReturnValue(new Set([new DOMRect(0, 0, 0, 0)]));

it('JsonEditor snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<JsonEditor value="error text{{" onChange={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<JsonEditor value="{}" onChange={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

test('JsonEditor input', (done) => {
  (async () => {
    const mockChange = jest.fn();
    render(<JsonEditor onChange={mockChange} />);
    const textbox = screen.getByRole('textbox');
    await userEvent.type(textbox, 'error text');

    expect(mockChange).toBeCalled();

    await userEvent.clear(textbox);
    await userEvent.type(textbox, '{{}');
    expect(mockChange).toHaveBeenLastCalledWith('{}');

    done();
  })();
});
