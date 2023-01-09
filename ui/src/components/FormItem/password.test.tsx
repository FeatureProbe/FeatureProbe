import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FieldErrorsImpl, useForm } from 'react-hook-form';
import { IntlWrapper } from 'components/utils/wrapper';
import FormItemPass from './password';

const SnapshotTest = (props: { errors?: Partial<FieldErrorsImpl<{
  [x: string]: unknown;
}>> }) => {
  const { register } = useForm();

  return <FormItemPass
    errors={props.errors ?? {}}
    register={register}
    onChange={() => {
      //
    }}
  />;
};

it('Password snapshot', () => {
  (async () => {
    const { asFragment, rerender } = render(
      <SnapshotTest />,
      {
        wrapper: IntlWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();

    rerender(<SnapshotTest errors={{
      password: {
        message: 'error message',
        type: 'deps'
      }
    }} />);

    expect(asFragment()).toMatchSnapshot();
  })();
});
