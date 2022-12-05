import { SyntheticEvent, useEffect } from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
import styles from './index.module.scss';

interface IProps {
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  onChange(e: SyntheticEvent, detail: InputOnChangeData): void;
}

const FormItemPassword = (props: IProps) => {
  const intl = useIntl();
  const { errors, register, onChange } = props;

  useEffect(() => {
    register('password', { 
      required: intl.formatMessage({id: 'login.password.required'}),
      minLength: {
        value: 4,
        message: intl.formatMessage({id: 'login.password.minlength'}),
      },
      maxLength: {
        value: 20,
        message: intl.formatMessage({id: 'login.password.maxlength'})
      },
      pattern: {
        value: /^[A-Z0-9._-]+$/i,
        message: intl.formatMessage({id: 'login.password.invalid'})
      }
    });
  }, [intl, register]);

  return (
    <>
      <Form.Field>
        <label>
          <span className={styles['label-required']}>*</span>
          <FormattedMessage id='common.password.text' />
        </label>

        <Form.Input
          name='password'
          className={styles.input}
          type='password'
          placeholder={intl.formatMessage({id: 'login.password.required'})} 
          error={ errors.password ? true : false }
          onChange={onChange}
        />
      </Form.Field>
      { errors.password && <div className={styles['error-text']}>{ errors.password.message }</div> }
      <div className={styles['tip-text']}>
        <FormattedMessage id='login.password.tips' />
      </div>
    </>
  );
};

export default FormItemPassword;