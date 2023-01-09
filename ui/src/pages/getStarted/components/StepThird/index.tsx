import { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { IRouterParams } from 'interfaces/project';
import styles from '../Steps/index.module.scss';

interface IProps {
  isLoading: boolean;
  currentStep: number;
  toggleAccess: boolean;
  projectKey: string;
  environmentKey: string;
  toggleKey: string;
  checkToggleStatus(): void;
  saveIsLoading(loading: boolean): void;
}

const CURRENT = 3;
const INTERVAL = 30;

const StepThird = (props: IProps) => {
  const { currentStep, toggleAccess, isLoading, checkToggleStatus, saveIsLoading } = props;
  const { toggleKey, environmentKey } = useParams<IRouterParams>();
  const [ count, saveCount ] = useState<number>(1);
  const intl = useIntl();
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
        checkToggleStatus();
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
  }, [count, isLoading, checkToggleStatus, saveIsLoading]);

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
                  toggleAccess ? (
                    <div className={styles['connect-success']}>
                      <Icon type='success-circle' customclass={styles['success-circle']} />
                      <FormattedMessage id='connect.fourth.success' />
                    </div>
                  ) : (
                    isLoading ? (
                      <div className={styles['connect-retrying']}>
                        <Loader  size='small' active inline='centered' />
                        <div className={styles['connect-retrying-text']}>
                          {
                            intl.formatMessage({
                              id: 'connect.fourth.running'
                            }, {
                              environment: environmentKey,
                              toggle: toggleKey,
                            })
                          }
                        </div>
                      </div>
                    ) : (
                      <div className={styles['connect-failed']}>
                        <div>
                          <Icon type='error-circle' customclass={styles['error-circle']} />
                          <FormattedMessage id='connect.fourth.failed' />
                          <a 
                            className={styles['error-link']}
                            target='_blank'
                            rel='noreferrer'
                            href='https://docs.featureprobe.io/zh-CN/how-to/faq/#14-%E6%8E%A5%E5%85%A5%E5%BC%95%E5%AF%BC%E6%8F%90%E7%A4%BA-%E6%82%A8%E6%B2%A1%E6%9C%89%E6%AD%A4-sdk-%E5%AF%86%E9%92%A5%E8%BF%9E%E6%8E%A5%E6%88%90%E5%8A%9F%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F-%E8%AF%A5%E5%A6%82%E4%BD%95%E6%8E%92%E6%9F%A5'
                          >
                            <FormattedMessage id='connect.fourth.failed.link' />
                          </a>
                        </div>
                        <div className={styles['retry-connection']}>
                          <Button primary className={styles['retry-connection-btn']} onClick={() => {
                            saveIsLoading(true);
                          }}>
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

export default StepThird;