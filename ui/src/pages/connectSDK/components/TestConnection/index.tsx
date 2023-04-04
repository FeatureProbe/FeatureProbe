import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { IRouterParams } from 'interfaces/project';
import styles from '../../index.module.scss';
import { CLICK, CUSTOM, PAGE_VIEW } from 'pages/analysis/constants';
import { IEvent } from 'interfaces/analysis';
import { DOC_FAQ_ACCESS_EN, DOC_FAQ_ACCESS_ZH, DOC_FAQ_TRACK_EN, DOC_FAQ_TRACK_ZH } from 'constants/docAddress';
import { SdkLanguage, SDK_LOGOS } from 'pages/connectSDK/constants';

interface IProps {
  isLoading: boolean;
  currentStep: number;
  isConnected?: boolean;
  projectKey: string;
  environmentKey: string;
  toggleKey: string;
  isTrackEvent?: boolean;
  eventInfo?: IEvent;
  currentSDK: SdkLanguage;
  checkStatus(): void;
  saveIsLoading(loading: boolean): void;
}

const CURRENT = 3;
const INTERVAL = 30;

const TestConnection = (props: IProps) => {
  const { currentStep, isConnected, isLoading, isTrackEvent, eventInfo, currentSDK, checkStatus, saveIsLoading } = props;
  const { toggleKey, environmentKey } = useParams<IRouterParams>();
  const [ count, saveCount ] = useState<number>(1);
  const [ displayName, saveDisplayName ] = useState<string>('');
  const intl = useIntl();
  const faqUrl = useRef('');
  const metricFaqUrl = useRef('');

  const stepTitleCls = classNames(
    styles['step-title'],
    {
      [styles['step-title-selected']]: currentStep === CURRENT
    }
  );

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        saveCount(count + 1);
        checkStatus();
      }, 1000);

      if (count >= INTERVAL) {
        clearInterval(timer);
        saveIsLoading(false);
        saveCount(1);
      }
  
      return (() => {
        clearInterval(timer);
      });
    }
  }, [count, isLoading, checkStatus, saveIsLoading]);

  useEffect(() => {
    if (intl.locale === 'zh-CN') {
      faqUrl.current = DOC_FAQ_ACCESS_ZH;
      metricFaqUrl.current = DOC_FAQ_TRACK_ZH;
    } else if(intl.locale === 'en-US') {
      faqUrl.current = DOC_FAQ_ACCESS_EN;
      metricFaqUrl.current = DOC_FAQ_TRACK_EN;
    }
  }, [intl.locale]);

  useEffect(() => {
    let name = '';
    if (eventInfo?.eventType === CUSTOM) {
      name = eventInfo?.eventName ?? '';
    } else if (eventInfo?.eventType === PAGE_VIEW) {
      name = intl.formatMessage({id: 'getstarted.track.pageview'});
    } else if (eventInfo?.eventType === CLICK) {
      name = intl.formatMessage({id: 'getstarted.track.click'});
    }
    saveDisplayName(name);
  }, [eventInfo, intl]);

  if (currentSDK) {
    console.log(SDK_LOGOS[currentSDK]);
  }

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT ? (
            <div className={styles.circleCurrent}>
              { CURRENT }
            </div>
          ) : (
            <div className={styles.circle}>
              { CURRENT }
            </div>
          )
        }
      </div>
      <div className={styles['step-right']}>
        <div className={stepTitleCls}>
          <FormattedMessage id='connect.fourth.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <>
                {
                  isConnected ? (
                    <div className={styles['connect-success']}>
                      <Icon type='success-circle' customclass={styles['success-circle']} />
                      {
                        isTrackEvent 
                          ? (
                            <>
                              { currentSDK && <img className={styles['connect-logo']} src={SDK_LOGOS[currentSDK]} alt='logo' /> }
                              { currentSDK }
                              <FormattedMessage id='connect.fourth.event.success' /> 
                            </>
                          ) : (
                            <>
                              { currentSDK && <img className={styles['connect-logo']} src={SDK_LOGOS[currentSDK]} alt='logo' /> }
                              { currentSDK }
                              <FormattedMessage id='connect.fourth.success' />
                            </>
                          )
                      }
                    </div>
                  ) : (
                    isLoading ? (
                      <div className={styles['connect-retrying']}>
                        <div className={styles.wrap}>
                          <div className={styles['circle-wrap']}>
                            <div className={`${styles['circle-left']} ${styles['wrap-all']}`}></div>
                          </div>
                          <div className={styles['circle-wrap']}>
                            <div className={`${styles['circle-right']} ${styles['wrap-all']}`}></div>
                          </div>
                      </div>
                        <div className={styles['connect-retrying-text']}>
                          {
                            isTrackEvent ? (
                              <div className={styles['connect-result']}>
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.event.running.left'
                                  }, {
                                    eventName: displayName,
                                    environment: environmentKey,
                                    toggle: toggleKey,
                                  })
                                }
                                { currentSDK && <img className={styles['connect-logo']} src={SDK_LOGOS[currentSDK]} alt='logo' /> }
                                { currentSDK }
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.event.running.right'
                                  }, {
                                    eventName: displayName,
                                    environment: environmentKey,
                                    toggle: toggleKey,
                                  })
                                }
                              </div>
                            ) : (
                              <div className={styles['connect-result']}>
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.running.left'
                                  }, {
                                    environment: environmentKey,
                                    toggle: toggleKey,
                                  })
                                }
                                { currentSDK && <img className={styles['connect-logo']} src={SDK_LOGOS[currentSDK]} alt='logo' /> }
                                { currentSDK }
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.running.right'
                                  }, {
                                    environment: environmentKey,
                                    toggle: toggleKey,
                                  })
                                }
                              </div>
                            )
                          }
                        </div>
                      </div>
                    ) : (
                      <div className={styles['connect-failed']}>
                        <div>
                          <Icon type='error-circle' customclass={styles['error-circle']} />
                          {
                            isTrackEvent ? (
                              <div className={styles['connect-result']}>
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.event.failed.left'
                                  }, {
                                    eventName: displayName,
                                    environment: environmentKey,
                                  })
                                }
                                { currentSDK && <img className={styles['connect-logo']} src={SDK_LOGOS[currentSDK]} alt='logo' /> }
                                { currentSDK }
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.event.failed.right'
                                  }, {
                                    eventName: displayName,
                                    environment: environmentKey,
                                  })
                                }
                              </div>
                            ) : (
                              <div className={styles['connect-result']}>
                                <FormattedMessage id='connect.fourth.failed.left' />
                                { currentSDK && <img className={styles['connect-logo']} src={SDK_LOGOS[currentSDK]} alt='logo' /> }
                                { currentSDK }
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.failed.right'
                                  }, {
                                    toggle: toggleKey,
                                    environment: environmentKey,
                                  })
                                }
                              </div>
                            )
                          }
                          <a 
                            className={styles['error-link']}
                            target='_blank'
                            rel='noreferrer'
                            href={isTrackEvent ? metricFaqUrl.current : faqUrl.current}
                          >
                            <FormattedMessage id='connect.fourth.failed.link' />
                          </a>
                         
                        </div>
                        <div className={styles['retry-connection']}>
                          <Button 
                            primary 
                            className={styles['retry-connection-btn']} 
                            onClick={() => {
                              saveIsLoading(true);
                            }}
                          >
                            <FormattedMessage id='connect.fourth.failed.button' />
                          </Button>
                        </div>
                      </div>
                    )
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
