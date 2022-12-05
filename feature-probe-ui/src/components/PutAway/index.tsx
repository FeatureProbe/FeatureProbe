import { useEffect } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { SidebarContainer } from 'layout/hooks';
import styles from './index.module.scss';

const PutAway = () => {
  const {
    isPutAway,
    setIsputAway
  } = SidebarContainer.useContainer();

  const putAwayCls = classNames(
    styles['put-away'],
    {
      [styles['put-away-close']]: isPutAway
    }
  );

  const putAwayDividerCls = classNames(
    styles['put-away-divider'],
    {
      [styles['put-away-divider-close']]: isPutAway
    }
  );

  useEffect(() => {
    setIsputAway(isPutAway);
    // TODO: better way
    const footerDom = document.getElementById('footer');
    if (footerDom) {
      if (isPutAway) {
        footerDom.style.left = '100px';
      } else {
        footerDom.style.left = '220px';
      }
    }
  }, [isPutAway, setIsputAway]);

  return (
    <div className={putAwayCls} onClick={() => {setIsputAway(!isPutAway);}}>
      <div className={putAwayDividerCls}></div>
      {
        isPutAway 
          ? <Icon customclass={styles.iconfont} type='put-up' /> 
          : <Icon customclass={styles.iconfont} type='put-away' />
      }
      {
        !isPutAway && <span className={styles.menu}>
          <FormattedMessage id='sidebar.putaway.text' />
        </span>
      }
    </div>
	);
};

export default PutAway;