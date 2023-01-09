import { ReactNode, SyntheticEvent, useEffect } from 'react';
import { Form, FormInputProps, InputOnChangeData } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
import styles from './index.module.scss';

interface IProps extends FormInputProps {
  value: string;
  errors: FieldErrors;
  size?: 'big' | 'small' | 'mini' | 'large' | 'huge' | 'massive' | undefined;
  className?: string;
  register: UseFormRegister<FieldValues>;
  onChange(e: SyntheticEvent, detail: InputOnChangeData): void;
  labelRender?: ReactNode;
}

const FormItemName = (props: IProps) => {
  const intl = useIntl();
  const { value, errors, size, className, register, onChange, labelRender } = props;

  useEffect(() => {
    register('name', { 
      required: intl.formatMessage({id: 'common.name.required'}),
    });
  }, [intl, register]);

  return (
    <div className={className}>
      <Form.Field>
        <label>
          <span className={styles['label-required']}>*</span>
          {labelRender ?? <FormattedMessage id='common.name.text' />}
        </label>
        <Form.Input
          name='name'
          size={size}
          className={styles.input}
          value={value}
          placeholder={intl.formatMessage({id: 'common.name.required'})}
          error={ errors.name ? true : false }
          onChange={onChange}
        />
      </Form.Field>
      { errors.name && <div className={styles['error-text']}>{ errors.name.message }</div> }
    </div>
  );
};

export default FormItemName;