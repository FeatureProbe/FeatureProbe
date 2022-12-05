import { useCallback, SyntheticEvent, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import Button from 'components/Button';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import EventTracker from 'components/EventTracker';
import { demoLogin } from 'services/user';
import { getRedirectUrl } from 'utils/getRedirectUrl';
import { EventTrack } from 'utils/track';
import { FORBIDDEN } from 'constants/httpCode';
import logo from 'images/logo_large.svg';
import { IUserInfo } from 'interfaces/member';
import styles from './index.module.scss';

const DemoLogin = () => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    EventTrack.pageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    register('account', { 
      required: {
        value: true,
        message: intl.formatMessage({id: 'common.email.placeholder.text'})
      },
      maxLength: {
        value: 30,
        message: intl.formatMessage({id: 'common.email.placeholder.text'})
      },
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i,
        message: intl.formatMessage({id: 'login.email.invalid.text'})
      }
    });
  }, [intl, register]);

  const gotoHome = useCallback(async () => {
    const redirectUrl = await getRedirectUrl('/notfound');
    history.push(redirectUrl);
  }, [history]);

  const onSubmit = useCallback(async (params) => {
    const res = await demoLogin<IUserInfo>({
      source: 'platform',
      ...params
    });
    const { success, data } = res;
    if (success && data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('organizeId', String(data.organizeId));
      localStorage.setItem('account', data.account);
      gotoHome();
    } 
    else if (res.code === FORBIDDEN) {
      message.error(intl.formatMessage({id: 'login.error.text'}));
    }
    else {
      message.error(intl.formatMessage({id: 'login.error.message'}));
    }
  }, [intl, gotoHome]);

	return (
		<div className={styles.login}>
      <div className={`${styles['demo-login-card']} login-card`}>
        <div className={styles['demo-product']}>
          <img className={styles.logo} src={logo} alt='logo' />
        </div>
        <div className={styles['demo-login-text']}>
          <FormattedMessage id='login.demo.text' />
        </div>
        <div className={styles['demo-login-tip']}>
          <FormattedMessage id='login.demo.tip' />
        </div>
        <div className={styles['demo-form']}>
          <Form 
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)} 
          >
            <Form.Field className={styles.field}>
              <label className={styles.label}>
                <Icon type='email' />
                <span className={styles['label-text']}>
                  <FormattedMessage id='common.email.text' />
                </span>
              </label>
              <Form.Input
                placeholder={intl.formatMessage({id: 'common.email.placeholder.text'})}
                name='account'
                error={ errors.account ? true : false }
                onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                  setValue(detail.name, detail.value);
                  await trigger('account');
                }}
              />
              { errors.account && <div className={styles['error-text']}>{ errors.account.message }</div> }
            </Form.Field>
            <div className={styles['demo-tips']}>
              <FormattedMessage id='login.demo.password.tip' />
            </div> 
            <div className={styles['demo-footer']}>
              <EventTracker category='login' action='demo-login'>
                <Button className={styles['demo-btn']} type='submit' primary disabled={!!errors.account || !!errors.password}>
                  <FormattedMessage id='login.signin' />
                </Button>
              </EventTracker>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;
