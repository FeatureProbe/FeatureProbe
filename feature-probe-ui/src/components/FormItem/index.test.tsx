import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FieldErrorsImpl, useForm } from 'react-hook-form';
import { IntlWrapper } from 'components/utils/wrapper';
import FormItem from '.';

it('Key snapshot', () => {
  (async () => {
    const { asFragment, rerender } = render(<FormItem label={'test label'}>test</FormItem>, {
      wrapper: IntlWrapper,
    });

    expect(asFragment()).toMatchSnapshot();

    rerender(
      <FormItem
        error={{
          key: {
            message: 'error message',
            type: 'deps',
          },
        }}
        label={'test label'}
        errorCss={{
          color: 'pink'
        }}
        required={true}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  })();
});
