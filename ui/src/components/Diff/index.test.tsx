import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Diff from './';
import { IntlWrapper } from 'components/utils/wrapper';
import { DiffStatusContent } from './DiffStatus';
import { useIntl } from 'react-intl';

const Component = () => {
  const intl = useIntl();
  return (
    <Diff
      sections={[
        {
          before: {
            disabled: true,
          },
          after: {
            disabled: false,
          },
          title: intl.formatMessage({ id: 'targeting.status.text' }),
          renderContent: (content) => {
            return <DiffStatusContent content={content} />;
          },
          diffKey: 'status',
        },
      ]}
    />
  );
};

it('Diff snapshot', (done) => {
  (async () => {
    const { asFragment } = render(<Component />, {
      wrapper: IntlWrapper,
    });
    expect(asFragment()).toMatchSnapshot();

    const tips = screen.getByText('The following is a before and after comparison of this change.');
    await userEvent.click(tips);
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});
