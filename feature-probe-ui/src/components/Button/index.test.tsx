import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Button from '.';

it('button snapshot', () => {
  (async () => {
    const { asFragment } = render(<Button>this is a Button</Button>);
    expect(asFragment()).toMatchSnapshot();
  })();
});

test('click button', (done) => {
  (async () => {
    const { rerender } = render(<Button key={1} onClick={(e) => {e.currentTarget.innerHTML = 'you clicked the button';}}>this is a Button</Button>);
    let html = screen.getByRole('button');
    await userEvent.click(html);
    expect(html.innerHTML).toBe('you clicked the button');

    rerender(<Button key={2}>this is a Button</Button>);
    html = screen.getByRole('button');
    await userEvent.click(html);
    expect(html.innerHTML).toBe('this is a Button');

    done();
  })();
});
