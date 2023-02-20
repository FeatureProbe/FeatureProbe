import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { Button } from 'semantic-ui-react';
import styles from './index.module.scss';

interface SizeTipsProps {
  hide: boolean;
  onConfirm: () => void;
  size: number;
}

const SizeTips: React.FC<SizeTipsProps> = (props) => {
  const { hide, onConfirm, size } = props;

  return (
    <div hidden={hide} className={styles['size-tips']}>
      <div className={styles['main']}>
        <div className={styles['icon']}>
          <Icon type="warning-circle" customclass={styles['warning-icon']} />
        </div>
        <div className={styles['content']}>
          <div className={styles['tips-title']}>
            <FormattedMessage id="targeting.size.tips.title" />
          </div>
          <div className={styles['tips-content']}>
            <FormattedMessage id="targeting.size.tips" values={{ size: Math.floor(size / 1024) }} />
          </div>
        </div>
      </div>
      <div className={styles['actions']}>
        <Button onClick={onConfirm} className={styles['button']} primary>
          <FormattedMessage id="common.know.text" />
        </Button>
      </div>
    </div>
  );
};

export default SizeTips;
