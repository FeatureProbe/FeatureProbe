import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PutAwayMenu from '.';
import sleep from 'utils/sleep';

console.error = jest.fn();

it('PutAwayMenu snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<PutAwayMenu isPutAway={true} title="title" type="type" />);
    expect(asFragment()).toMatchSnapshot();
    rerender(<PutAwayMenu isPutAway={false} title="title" type="type" />);
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('hover PutAwayMenu', (done) => {
  (async () => {
    const { baseElement } = render(<PutAwayMenu isPutAway={true} title="title" type="type" />);
    const ele = screen.getAllByRole('generic').pop();
    expect(ele).not.toBeUndefined();
    
    if(ele) {
      await userEvent.hover(ele);
      await sleep(1000);
    }

    expect(baseElement).toMatchSnapshot();

    done();
  })();
});
