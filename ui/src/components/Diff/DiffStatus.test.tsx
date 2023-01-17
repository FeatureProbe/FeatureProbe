import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiffStatusContent } from './DiffStatus';
import { IntlWrapper } from 'components/utils/wrapper';
import idiff from './diff';

const content_a = idiff(
  {
    disabled: true,
  },
  {
    disabled: false,
  }
);

const content_b = idiff(
  {
    disabledErr: true,
  },
  {
    disabledErr: false,
  }
);

const content_c = idiff(
  {
    disabled: false,
  },
  {
    disabled: true,
  }
);

it('DiffStatus snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<DiffStatusContent content={content_a} />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffStatusContent content={content_b} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffStatusContent content={content_c} />);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
