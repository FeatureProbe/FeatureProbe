import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import { getRedirectUrl } from 'utils/getRedirectUrl';
import { EventTrack } from 'utils/track';
import styles from './index.module.scss';

const NotFound = () => {
  const history = useHistory();
  const [ redirectUrl, setRedirectUrl ] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    EventTrack.pageView(location.pathname);
  }, [location.pathname]);

  const handleGoHome = useCallback(() => {
    history.push(redirectUrl);
  }, [history, redirectUrl]);

  const init = useCallback(async() => {
    const redirectUrl = await getRedirectUrl('/notfound');
    setRedirectUrl(redirectUrl);
  }, []);
  
  useEffect(() => {
    init();
  }, [init]);

	return (
		<div className={styles['not-found']}>
      <div className={styles.content}>
        <div className={styles.image}>
          <img src={require('images/not-found.png')}  alt='404' />
        </div>
        <div className={styles.description}>
          <div className={styles.title}>404</div>
          <div>
            <FormattedMessage id='notfound.description' />
          </div>
          <div className={styles.btn}>
            <Button onClick={handleGoHome} primary>
              <FormattedMessage id='notfound.button' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
