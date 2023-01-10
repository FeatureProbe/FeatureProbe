import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiffServe } from './DiffServe';
import idiff from './diff';
import { IntlWrapper } from 'components/utils/wrapper';

const content_a = idiff(
  {
    select: 'name 1',
  },
  {
    select: 'name 2',
  }
);

const content_b = idiff(
  {
    select: 'name 1',
  },
  {
    split: [50, 20],
  }
);

const content_c = idiff(
  {
    select: 'name 1',
  },
  {
    select: 'name 1',
  }
);

const content_d = idiff(
  {
    split: [50, 50],
  },
  {
    split: [40, 60],
  }
);

const content_e = {
  split: [10, 90]
};

const content_f = {
  select: 'name 1'
};

const content_g = idiff(
  {
    split: [50, 50],
  },
  {
    split: [50, 60],
  }
);

it('DiffServe snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(<DiffServe content={content_a} />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffServe content={content_b} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffServe content={content_c} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffServe content={content_d} />);
    expect(asFragment()).toMatchSnapshot();
    
    rerender(<DiffServe content={content_e} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffServe content={content_f} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(<DiffServe content={content_g} />);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
