import { Popup } from 'semantic-ui-react';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IProps {
  isPutAway: boolean;
  title: string;
  type: string;
}

const PutAwayMemu = (props: IProps) => {
  const { isPutAway, title, type } = props;

  return (
    <div className={styles.putaway}>
      {
        isPutAway ? (
          <>
            <Popup 
              inverted
              position='right center'
              offset={[0, 20]}
              content={title} 
              style={{opacity: 0.8}}
              trigger={
                <Icon customclass={styles['iconfont']} type={type} />
              } 
            />
          </>
        ) : (
          <>
            <Icon customclass={styles['iconfont']} type={type} />
            <span className={styles.menu}>
              {title}
            </span>
          </>
        )
      }
    </div>
	);
};

export default PutAwayMemu;