import { useEffect, useRef, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { IRouterParams } from 'interfaces/project';
import styles from '../../index.module.scss';
import { CLICK, CUSTOM, PAGE_VIEW } from 'pages/analysis/constants';
import { IEvent } from 'interfaces/analysis';

interface IProps {
  isLoading: boolean;
  currentStep: number;
  isConnected?: boolean;
  projectKey: string;
  environmentKey: string;
  toggleKey: string;
  isTrackEvent?: boolean;
  eventInfo?: IEvent;
  checkStatus(): void;
  saveIsLoading(loading: boolean): void;
}

const CURRENT = 3;
const INTERVAL = 30;

const TestConnection = (props: IProps) => {
  const { currentStep, isConnected, isLoading, isTrackEvent, eventInfo, checkStatus, saveIsLoading } = props;
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
      faqUrl.current = 'https://docs.featureprobe.io/zh-CN/introduction/faq/#14-%E6%8E%A5%E5%85%A5%E5%BC%95%E5%AF%BC%E6%8F%90%E7%A4%BA-%E6%82%A8%E6%B2%A1%E6%9C%89%E6%AD%A4-sdk-%E5%AF%86%E9%92%A5%E8%BF%9E%E6%8E%A5%E6%88%90%E5%8A%9F%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F-%E8%AF%A5%E5%A6%82%E4%BD%95%E6%8E%92%E6%9F%A5';
      metricFaqUrl.current = 'https://docs.featureprobe.io/zh-CN/introduction/faq#15-%E6%8E%A5%E5%85%A5%E5%BC%95%E5%AF%BC%E6%8F%90%E7%A4%BA-%E6%82%A8%E6%B2%A1%E6%9C%89%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E6%AD%A3%E5%9C%A8-x-%E7%8E%AF%E5%A2%83%E4%B8%AD%E7%9B%91%E5%90%AC-x-%E5%BC%80%E5%85%B3%E7%9A%84-x-%E4%BA%8B%E4%BB%B6-%E8%AF%A5%E5%A6%82%E4%BD%95%E6%8E%92%E6%9F%A5';
    } else if(intl.locale === 'en-US') {
      faqUrl.current = 'https://docs.featureprobe.io/introduction/faq/#14-how-to-solve-you-have-no-applications-connected-using-this-sdk-key-in-user-guidance-of-sdk-initialization';
      metricFaqUrl.current = 'https://docs.featureprobe.io/introduction/faq/#15-how-to-solve-you-dont-have-any-application-listening-for-the-x-event-on-x-toggle-in-x-environment';
    }
  }, [intl]);

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
                          ? <FormattedMessage id='connect.fourth.event.success' /> 
                          : <FormattedMessage id='connect.fourth.success' />
                      }
                    </div>
                  ) : (
                    isLoading ? (
                      <div className={styles['connect-retrying']}>
                        <Loader  size='small' active inline='centered' />
                        <div className={styles['connect-retrying-text']}>
                          {
                            isTrackEvent ? (
                              <>
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.event.running'
                                  }, {
                                    eventName: displayName,
                                    environment: environmentKey,
                                    toggle: toggleKey,
                                  })
                                }
                              </>
                            ) : <>
                              {
                                intl.formatMessage({
                                  id: 'connect.fourth.running'
                                }, {
                                  environment: environmentKey,
                                  toggle: toggleKey,
                                })
                              }
                            </>
                          }
                        </div>
                      </div>
                    ) : (
                      <div className={styles['connect-failed']}>
                        <div>
                          <Icon type='error-circle' customclass={styles['error-circle']} />
                          {
                            isTrackEvent ? (
                              <>
                                {
                                  intl.formatMessage({
                                    id: 'connect.fourth.event.failed'
                                  }, {
                                    eventName: displayName,
                                    environment: environmentKey,
                                    toggle: toggleKey,
                                  })
                                }
                                
                              </>
                            ) : <FormattedMessage id='connect.fourth.failed' />
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
