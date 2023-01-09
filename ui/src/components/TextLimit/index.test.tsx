import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TextLimit from '.';
import sleep from 'utils/sleep';

it('TextLimit snapshot', () => {
  (async () => {
    const { asFragment, rerender } = render(<TextLimit text="These are test words." maxLength={10} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<TextLimit text="These are test words." maxWidth={40} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <TextLimit popupRender={<div>test</div>} text="These are test words." maxLength={1000} />
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <TextLimit hidePopup text="These are test words." maxWidth={1000} />
    );
    expect(asFragment()).toMatchSnapshot();
  })();
});

console.error = jest.fn;

test('TextLimit text maxLenth test', (done) => {
  (async () => {
    const { baseElement } = render(<TextLimit text="This is a test text." maxLength={10} />);

    expect(screen.getByText('This is...')).toBeInTheDocument();
    await userEvent.hover(screen.getByText('This is...'));
    await sleep(200);

    expect(baseElement).toMatchSnapshot();
    done();
  })();
});

test('TextLimit text maxWidth test', (done) => {
  (async () => {
    const { baseElement } = render(<TextLimit text="This is a test text." maxWidth={50} />);

    expect(screen.getByText('This is a test text.')).toBeInTheDocument();
    await userEvent.hover(screen.getByText('This is a test text.'));
    await sleep(200);

    expect(baseElement).toMatchSnapshot();
    done();
  })();
});
