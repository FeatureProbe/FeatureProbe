import { Popup } from 'semantic-ui-react';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IProp {
  title: string;
  tooltipText?: string;
  showTooltip?: boolean;
}

const SectionTitle = (props: IProp) => {
  const { title, tooltipText, showTooltip } = props;
	return (
    <div className={styles.title}>
      <div className={styles.divider}></div>
      <div className={styles.name}>{ title }</div>
      {
        showTooltip && (
          <Popup
            inverted
            style={{ opacity: 0.8 }}
            trigger={<Icon type='question' customclass={styles['icon-question']} />}
            content={ tooltipText }
            position='top center'
          />
        )
      }
    </div>
	);
};

export default SectionTitle;