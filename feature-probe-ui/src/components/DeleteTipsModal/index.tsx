import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { ReactNode, SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonProps } from 'semantic-ui-react';

import styles from './index.module.scss';

interface DeleteTipsModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  content: ReactNode;
  title: ReactNode;
  renderFooter?: (nodes: ButtonProps[]) => ButtonProps[];
}

const DeleteTipsModal: React.FC<DeleteTipsModalProps> = (props) => {
  const { open, onCancel, onConfirm, content, title, renderFooter } = props;

  return (
    <Modal
      open={open}
      width={400}
      footer={null}
    >
      <div>
        <div className={styles['modal-header']}>
          <Icon customclass={styles['warning-circle']} type="warning-circle" />
          <span className={styles['modal-header-text']}>
            {title}
          </span>
        </div>
        <div className={styles['modal-content']}>
          {content}
        </div>
        <div className={styles['footer']}>
          {(() => {
            const buttonProps: ButtonProps[] = [
              {
                size: 'mini',
                className: styles['btn'],
                type: 'reset',
                basic: true,
                onClick: (e: SyntheticEvent) => {
                  e.stopPropagation();
                  onCancel();
                },
                key: 'cancel',
                children: <FormattedMessage id="common.cancel.text" />
              },
              {
                size: 'mini',
                className: styles['btn'],
                type: 'submit',
                primary: true,
                onClick: (e: SyntheticEvent) => {
                  e.stopPropagation();
                  onConfirm();
                },
                key: 'confirm',
                children: <FormattedMessage id="common.confirm.text" />
              },
            ];
            const props = renderFooter ? renderFooter(buttonProps) : buttonProps;
            return props.map((prop) => {
              return <Button {...prop} />;
            });
          })()}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTipsModal;
