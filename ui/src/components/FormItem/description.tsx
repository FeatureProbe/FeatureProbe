import { SyntheticEvent } from 'react';
import { Form, FormTextAreaProps, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './index.module.scss';

interface IProps extends FormTextAreaProps {
  value: string;
  size?: 'big' | 'small' | 'mini' | 'large' | 'huge' | 'massive' | undefined;
  className?: string;
  onChange(e: SyntheticEvent, detail: TextAreaProps): void;
}

const FormItemDescription = (props: IProps) => {
  const intl = useIntl();
  const { value, className, onChange } = props;

  return (
    <div className={className}>
      <Form.Field>
        <label>
          <FormattedMessage id='common.description.text' />
        </label>
        <Form.TextArea 
          value={value} 
          placeholder={intl.formatMessage({id: 'common.description.required'})}
          className={styles.input}
          onChange={onChange}
        />
      </Form.Field>
    </div>
  );
};

export default FormItemDescription;