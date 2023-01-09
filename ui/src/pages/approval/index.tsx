import classNames from 'classnames';
import { HeaderContainer } from 'layout/hooks';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import Lists from './components/Lists';
import styles from './index.module.scss';

const LIST = '/approvals/list';
const MINE = '/approvals/mine';

const Approvals = () => {
  const [ selectedNav, saveSelectedNav ] = useState<string>(LIST);
  const location = useLocation();
  const history = useHistory();
  const { approvalCount } = HeaderContainer.useContainer();
  
  const listCls = classNames(
    styles['navs-item'],
    {
      [styles['navs-item-selected']]: selectedNav === LIST
    }
  );

  const mineCls = classNames(
    styles['navs-item'],
    {
      [styles['navs-item-selected']]: selectedNav === MINE
    }
  );

  useEffect(() => {
    if (location.pathname === LIST) {
      saveSelectedNav(LIST);
    }
    else if (location.pathname === MINE) {
      saveSelectedNav(MINE);
    }
  }, [location.pathname]);

  return (
    <div className={styles.approvals}>
      <div className={styles.navs}>
        <div 
          className={listCls} 
          onClick={() => { 
            history.push(LIST);
          }}
        >
          <FormattedMessage id='approvals.lists' />
          { approvalCount !== 0 && <span className={styles.count}>{approvalCount > 99 ? '99+' : approvalCount}</span> }
        </div>
        <div 
          className={mineCls} 
          onClick={() => { 
            history.push(MINE);
          }}
        >
          <FormattedMessage id='approvals.application.lists' />
        </div>
      </div>
      <Lists />
    </div>
  );
};

export default Approvals;
