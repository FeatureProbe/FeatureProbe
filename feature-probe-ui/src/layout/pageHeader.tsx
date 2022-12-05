import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import { PROJECT_PATH } from 'router/routes';
import { getUserInfo } from 'services/user';
import { getApprovalTotalByStatus } from 'services/approval';
import { IUser } from 'interfaces/member';
import { IApprovalTotal } from 'interfaces/approval';
import { I18NContainer } from 'hooks';
import { APPROVAL_ROUTE_LIST, PROJECT_ROUTE_LIST, SETTING_ROUTE_LIST } from 'constants/pathname';
import logo from 'images/logo.svg';
import logoWhite from 'images/logo-white.svg';
import { HeaderContainer } from './hooks';
import { EventTrack } from 'utils/track';
import serviceManualSvg from 'images/service-manual.svg';
import styles from './pageHeader.module.scss';

const PROJECT_NAV = 'projects';
const SETTING_NAV = 'settings';
const APPROVAL_NAV = 'approvals';
const EMPTY_NAV = 'empty';
const isMainColorHeader = false;

const PageHeader = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const { approvalCount, saveUserInfo, saveApprovalCount } = HeaderContainer.useContainer();

  const [ selectedNav, setSelectedNav ] = useState<string>('');
  const [ account, setAccount ] = useState<string>('');
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  const [ helpMenuOpen, setHelpMenuOpen ] = useState<boolean>(false);
  const [ i18nMenuOpen, setI18nMenuOpen ] = useState<boolean>(false);

  const {
    i18n,
    setI18n
  } = I18NContainer.useContainer();

  const timer: { current: NodeJS.Timeout | null } = useRef(null);

  const headerCls = classNames(
    styles['header'],
    {
      [styles['header-main']]: isMainColorHeader
    }
  );

  const projectCls = classNames(
    'navs-item',
    {
      'navs-item-selected': selectedNav === PROJECT_NAV
    }
  );

  const settingCls = classNames(
    'navs-item',
    {
      'navs-item-selected': selectedNav === SETTING_NAV
    }
  );

  const approvalCls = classNames(
    'navs-item',
    {
      'navs-item-selected': selectedNav === APPROVAL_NAV
    }
  );

  useEffect(() => {
    const handler = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
      if (helpMenuOpen) {
        setHelpMenuOpen(false);
      }
      if (i18nMenuOpen) {
        setI18nMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [menuOpen, helpMenuOpen, i18nMenuOpen]);

  useEffect(() => {
    getUserInfo<IUser>().then(res => {
      const { success } = res;
      if (success) {
        if (res.data) {
          setAccount(res.data.account);
          saveUserInfo(res.data);
          EventTrack.setUserId(res.data.account);
        }
      } else {
        message.error(intl.formatMessage({id: 'header.getuser.error.text'}));
      }
    });
  }, [intl, saveUserInfo]);

  const initApprovalList = useCallback(() => {
    getApprovalTotalByStatus<IApprovalTotal>({
			status: 'PENDING'
		}).then(res => {
			const { success, data } = res;
			if (success && data) {
				const { total } = data;
        saveApprovalCount(total);
      }
		});
  }, [saveApprovalCount]);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    initApprovalList();
    timer.current = setInterval(initApprovalList, 5000);
    
    return () => {
      clearInterval(timer.current as NodeJS.Timeout);
    };
  }, [initApprovalList]);

  useEffect(() => {
    const reg = new RegExp('[^/]+$');
    const res = reg.exec(location.pathname);

    if (res && res[0]) {
      if (PROJECT_ROUTE_LIST.includes(res[0])) {
        setSelectedNav(PROJECT_NAV);
      }
      else if (SETTING_ROUTE_LIST.includes(res?.input)) {
        setSelectedNav(SETTING_NAV);
      }
      else if (APPROVAL_ROUTE_LIST.includes(res?.input)) {
        setSelectedNav(APPROVAL_NAV);
      }
      else {
        setSelectedNav(EMPTY_NAV);
      }
    }
  }, [location.pathname]);

  const handleGotoProject = useCallback(() => {
    history.push(PROJECT_PATH);
  }, [history]);

  const handleGotoAccount = useCallback(() => {
    history.push('/settings/members');
  }, [history]);

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organizeId');
    localStorage.removeItem('account');
    history.push('/login');
  }, [history]);

  const handleGotoGithub = useCallback(() => {
    window.open('https://github.com/FeatureProbe/FeatureProbe');
  }, []);

  const handleGotoDocument = useCallback(() => {
    if (i18n === 'en-US') {
      window.open('https://docs.featureprobe.io/');
    } else {
      window.open('https://docs.featureprobe.io/zh-CN');
    }
  }, [i18n]);

  const handleGotoApproval = useCallback(() => {
    history.push('/approvals/list');
  }, [history]);

  const handleGotoProfile = useCallback(() => {
    history.push('/user/profile');
  }, [history]);

  return (
    <div className={headerCls}>
      <div className={styles.logo} onClick={handleGotoProject}>
        {
          isMainColorHeader 
          ? <img className={styles['logo-image']} src={logoWhite} alt='logo' />
          : <img className={styles['logo-image']} src={logo} alt='logo' />
        }
      </div>
      <div className={`${styles.navs} project-nav`}>
        <div className='joyride-project'>
          <div className={projectCls} onClick={handleGotoProject}>
            <FormattedMessage id='common.projects.text' />
          </div>
        </div>
        <div className={settingCls} onClick={handleGotoAccount}>
          <FormattedMessage id='common.settings.text' />
        </div>
      
        <div className={approvalCls} onClick={handleGotoApproval}>
          <FormattedMessage id='approvals.center' />
          { approvalCount !== 0 && <span className={styles.count}>{approvalCount > 99 ? '99+' : approvalCount}</span> }
        </div>
      </div>
      <div className={'user'}>
        <Popup
          basic
          open={i18nMenuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div 
              onClick={(e: SyntheticEvent) => {
                document.body.click();
                e.stopPropagation();
                setI18nMenuOpen(true);
              }}
              className={styles['language-popup']}
            >
              {i18n === 'en-US' ? 'English' : '中文'}
              <Icon customclass={styles['angle-down']} type='angle-down' />
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setI18nMenuOpen(false);}}>
            <div className={styles['menu-item']} onClick={()=> {setI18n('en-US');}}>
              English
            </div>
            <div className={styles['menu-item']} onClick={()=> {setI18n('zh-CN');}}>
              中文
            </div>
          </div>
        </Popup>
        <Popup
          basic
          open={helpMenuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div 
              onClick={(e: SyntheticEvent) => {
                document.body.click();
                e.stopPropagation();
                setHelpMenuOpen(true);
              }}
              className={styles['question-popup']}
            >
              <img src={serviceManualSvg} alt='doc' />
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setHelpMenuOpen(false);}}>
            <div 
              className={styles['menu-item']} 
              onClick={()=> {
                handleGotoDocument();
              }}
            >
              <FormattedMessage id='common.documentation.text' />
            </div>
            <div 
              className={styles['menu-item']} 
              onClick={()=> {
                handleGotoGithub();
              }}
            >
              Github
            </div>
          </div>
        </Popup>
        <Popup
          basic
          open={menuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div className={styles['user-container']} onClick={(e: SyntheticEvent) => {
              document.body.click();
              e.stopPropagation();
              setMenuOpen(true);
            }}>
             <span className={'user-circle'}>
                <Icon customclass={styles['icon-avatar']} type='avatar' />
              </span>
              <span className={styles.username}>{ account }</span>
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setMenuOpen(false);}}>
            <div className={styles['menu-item']} onClick={handleGotoProfile}>
              <FormattedMessage id='common.profile.text' />
            </div>
            <div className={styles['menu-item']} onClick={handleLogout}>
              <FormattedMessage id='common.logout.text' />
            </div>
          </div>
        </Popup>
      </div>
    </div>
	);
};

export default PageHeader;