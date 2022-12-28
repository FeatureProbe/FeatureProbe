import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { ReactNode } from 'react';
import styles from './index.module.scss';

interface DiffProps {
  sections: ReactNode;
  height?: number;
  maxHeight?: number;
}

const Diff: React.FC<DiffProps> = (props) => {
  const { sections } = props;

  return (
    <div className={styles.box}>
      <div className={styles.tips}>
        <Icon type="warning-circle" customclass={styles['warning-circle']} />
        <FormattedMessage id="common.diff.tips" />
      </div>
      <div className={styles['diff']}>
        {sections}
      </div>
    </div>
  );
};

export default Diff;
