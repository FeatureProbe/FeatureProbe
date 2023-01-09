import { ReactElement, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from './pageHeader';
import { HeaderContainer } from './hooks';
import { EventTrack } from 'utils/track';
import styles from './layout.module.scss';

interface IProps {
  children: ReactElement
}

const BasicLayout = (props: IProps) => {
  const location = useLocation();

  useEffect(() => {
    EventTrack.pageView(location.pathname);
  }, [location.pathname]);

  return (
		<div className={styles.app}>
      <HeaderContainer.Provider>
        <PageHeader />
        <div className={styles.content}>
          { props.children }
        </div>
      </HeaderContainer.Provider>
		</div>
	);
};

export default BasicLayout;