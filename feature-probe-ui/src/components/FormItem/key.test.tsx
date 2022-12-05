import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FieldErrorsImpl, useForm } from 'react-hook-form';
import { IntlWrapper } from 'components/utils/wrapper';
import FormItemKey from './key';

const SnapshotTest = (props: { errors?: Partial<FieldErrorsImpl<{
  [x: string]: unknown;
}>> }) => {
  const { register } = useForm();

  return <FormItemKey
    value='test'
    showPopup={true}
    disabled={false}
    errors={props.errors ?? {}}
    register={register}
    onChange={() => {
      //
    }}
  />;
};

it('Key snapshot', () => {
  (async () => {
    const { asFragment, rerender } = render(
      <SnapshotTest />,
      {
        wrapper: IntlWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();

    rerender(<SnapshotTest errors={{
      key: {
        message: 'error message',
        type: 'deps'
      }
    }} />);

    expect(asFragment()).toMatchSnapshot();
  })();
});
