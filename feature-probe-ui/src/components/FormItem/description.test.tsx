import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FieldErrorsImpl, useForm } from 'react-hook-form';
import { IntlWrapper } from 'components/utils/wrapper';
import FormItemDes from './description';

const SnapshotTest = (props: { errors?: Partial<FieldErrorsImpl<{
  [x: string]: unknown;
}>> }) => {
  const { register } = useForm();

  return <FormItemDes
    value='test'
    showPopup={true}
    disabled={false}
    errors={props.errors ?? {}}
    register={register}
    onChange={jest.fn()}
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
      description: {
        message: 'error message',
        type: 'deps'
      }
    }} />);

    expect(asFragment()).toMatchSnapshot();
  })();
});
