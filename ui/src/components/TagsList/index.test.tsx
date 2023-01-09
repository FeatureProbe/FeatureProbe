import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TagsList from '.';
import sleep from 'utils/sleep';

it('TagsList snapshot', (done) => {
  (async () => {
    const { asFragment } = render(<TagsList tags={['test1', 'test2']} />);
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

it('click TagsList more', (done) => {
    (async () => {
      const { baseElement } = render(<TagsList tags={['test1', 'test2']} showCount={1} />);
      expect(baseElement).toMatchSnapshot();

      await userEvent.click(screen.getByText('+1...'));
      await sleep(1000);

      expect(baseElement).toMatchSnapshot();
      done();
    })();
  });