import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FieldErrorsImpl, useForm } from 'react-hook-form';
import { IntlWrapper } from 'components/utils/wrapper';
import FormItemName from './name';

const SnapshotTest = (props: { errors?: Partial<FieldErrorsImpl<{
  [x: string]: unknown;
}>> }) => {
  const { register } = useForm();

  return <FormItemName
    value='test'
    errors={props.errors ?? {}}
    register={register}
    onChange={() => {
      //
    }}
  />;
};

it('Name snapshot', () => {
  (async () => {
    const { asFragment, rerender } = render(
      <SnapshotTest />,
      {
        wrapper: IntlWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();

    rerender(<SnapshotTest errors={{
      name: {
        message: 'error message',
        type: 'deps'
      }
    }} />);

    expect(asFragment()).toMatchSnapshot();
  })();
});
