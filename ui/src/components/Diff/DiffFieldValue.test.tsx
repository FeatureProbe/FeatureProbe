import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiffFieldValue } from './DiffFieldValue';
import { IntlWrapper } from 'components/utils/wrapper';

it('DiffFieldValue snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<DiffFieldValue value="Test Text" type="same" />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffFieldValue value="Test Text" type="remove" />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffFieldValue value="Test Text" type="add" />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffFieldValue value={['Test Text1', 'Test text2']} type="remove" />);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
