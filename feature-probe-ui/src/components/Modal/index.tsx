import { ReactElement, SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'semantic-ui-react';
import Button from 'components/Button';
import styles from './index.module.scss';

interface IProps {
  width?: number;
  open: boolean;
  confirmDisabled?: boolean;
  handleCancel?(e: SyntheticEvent): void;
  handleConfirm?(e: SyntheticEvent): void;
  children: ReactElement;
  footer?: ReactElement | null;
}

const ConfirmModal = (props: IProps) => {
  const { open, width, children, footer, confirmDisabled, handleConfirm, handleCancel } = props;

  return (
    <Modal
      // unstackable
      size={'mini'}
      open={open}
      onClose={handleCancel}
      style={{width: `${width || 400}px`}}
    >
      <Modal.Content>
        { children }
        {
          (typeof(footer) === 'undefined') ? (
            <div className={styles['footer']} onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
              <Button size='mini' className={styles['btn']} basic type='reset' onClick={handleCancel}>
                <FormattedMessage id='common.cancel.text' />
              </Button>
              <Button size='mini' type='submit' primary disabled={confirmDisabled} onClick={handleConfirm}>
                <FormattedMessage id='common.confirm.text' />
              </Button>
            </div>
          ) : <>
            { footer }
          </>
        }
      </Modal.Content>
    </Modal>
  );
};
  
export default ConfirmModal;