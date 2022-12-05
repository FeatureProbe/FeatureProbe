import { ReactNode } from 'react';
import styles from './settingCard.module.scss';

interface SettingCardProps {
  title: ReactNode;
}

const SettingCard: React.FC<SettingCardProps> = (props) => {
  const { title, children } = props;

  return (
    <div className={styles.card}>
      <div className={styles.heading}>{title}</div>
      {children}
    </div>
  );
};

export default SettingCard;
