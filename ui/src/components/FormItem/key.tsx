import { SyntheticEvent, useEffect } from 'react';
import { Form, InputOnChangeData, Popup } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IProps {
  value: string;
  disabled: boolean;
  errors: FieldErrors;
  showPopup?: boolean;
  popupText?: string;
  className?: string;
  size?: 'big' | 'small' | 'mini' | 'large' | 'huge' | 'massive' | undefined;
  register: UseFormRegister<FieldValues>;
  onChange(e: SyntheticEvent, detail: InputOnChangeData): void;
}

const FormItemKey = (props: IProps) => {
  const intl = useIntl();
  const { value, errors, disabled, showPopup, popupText, size, className, register, onChange } = props;

  useEffect(() => {
    register('key', { 
      required: intl.formatMessage({id: 'common.key.required'}),
      minLength: {
        value: 2,
        message: intl.formatMessage({id: 'common.minimum.two'})
      },
      maxLength: {
        value: 30,
        message: intl.formatMessage({id: 'common.maximum.thirty'})
      },
      pattern: {
        value: /^[A-Z0-9._-]+$/i,
        message: intl.formatMessage({id: 'common.key.invalid'})
      }
    });
  }, [intl, register]);

  return (
    <div className={className}>
       <Form.Field>
        <label>
          <span className={styles['label-required']}>*</span>
          <FormattedMessage id='common.key.text' />
          {
            showPopup && (
              <Popup
                inverted
                className='popup-override'
                trigger={
                  <Icon customclass={styles['icon-question']} type='question' />
                }
                content={popupText}
                position='top center'
              />
            )
          }
        </label>

        <Form.Input
          name='key'
          size={size}
          className={styles.input}
          value={value}
          placeholder={intl.formatMessage({id: 'common.key.required'})}
          error={ errors.key ? true : false }
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Field>
      { errors.key && <div className={styles['error-text']}>{ errors.key.message }</div> }
      <div className={styles['tip-text']}>
        <FormattedMessage id='common.key.tips' />
      </div>
    </div>
  );
};

export default FormItemKey;