import { ReactElement, SyntheticEvent } from 'react';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  text: string;
  children: ReactElement;
  handleCancel(e: SyntheticEvent): void;
  handleConfirm(e: SyntheticEvent): void;
}

const PopupConfirm = (props: IProps) => {
  const { text, open, children, handleConfirm, handleCancel } = props;

  return (
    <Popup open={open} trigger={children} flowing hoverable on='click' className={styles.popup}>
      <div className={styles.content}>
        <Icon customclass={styles.iconfont} type='error-circle' />
        <span>
          { text }
        </span>
      </div>
      <div className={styles['btn-group']}>
        <Button className={styles['btn-cancel']} size='mini' secondary onClick={handleCancel}>
          <FormattedMessage id='common.cancel.text' />
        </Button>
        <Button size='mini' primary onClick={handleConfirm}>
          <FormattedMessage id='common.confirm.text' />
        </Button>
      </div>
    </Popup>
  );
};
  
export default PopupConfirm;