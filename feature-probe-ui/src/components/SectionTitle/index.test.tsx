import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionTitle from '.';

it('PutAwayMenu snapshot', (done) => {
  (async () => {
    const { asFragment } = render(<SectionTitle title="title" tooltipText="tooltipText" showTooltip={true} />);
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});
