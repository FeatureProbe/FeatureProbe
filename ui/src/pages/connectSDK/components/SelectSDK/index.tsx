import { useEffect, useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { CLIENT_SIDE_SDKS, SdkLanguage, SDK_LOGOS, SERVER_SIDE_SDKS, CLIENT_SIDE_AUTO_REPORT_SDKS } from '../../constants';
import { IEvent } from 'interfaces/analysis';
import { CLICK, PAGE_VIEW } from 'pages/analysis/constants';

import styles from '../../index.module.scss';

interface IOption {
  name: string;
  logo: string
}

interface IProps {
  currentStep: number;
  currentSDK: SdkLanguage;
  clientAvailability: boolean;
  eventInfo?: IEvent;
  saveStep(sdk: string): void;
  goBackToStep(step: number): void;
  saveCurrentSDK(sdk: SdkLanguage): void;
}

const CURRENT = 1;

const SelectSDK = (props: IProps) => {
  const { currentStep, currentSDK, clientAvailability, eventInfo, saveStep, goBackToStep, saveCurrentSDK } = props;
  const [ selectedSDKLogo, saveSelectedSDKLogo ] = useState<string>('');
  const intl = useIntl();

  const stepTitleCls = classNames(
    styles['step-title'],
    {
      [styles['step-title-selected']]: currentStep === CURRENT
    }
  );

  useEffect(() => {
    if (currentSDK) {
      saveSelectedSDKLogo(SDK_LOGOS[currentSDK]);
    }
  }, [currentSDK]);

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT && (
            <>
              <div className={styles.circleCurrent}>{ CURRENT }</div>
              <div className={styles.line}></div>
            </>
          )
        }
        {
          currentStep < CURRENT && (
            <>
              <div className={styles.circle}>{ CURRENT }</div>
              <div className={styles.line}></div>
            </>
          )
        }
        {
          currentStep > CURRENT && (
            <>
              <div className={styles.checked}>
                <Icon type='check-circle' customclass={styles['checked-circle']} />
              </div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
      </div>
      <div className={styles['step-right']}>
        <div className={stepTitleCls}>
          <FormattedMessage id='connect.second.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <Form className={styles.form}>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='connect.second.sdk' />
                  </label>
                  <Dropdown
                    floating
                    labeled
                    basic
                    className={styles['dropdown-com']}
                    icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                    trigger={
                      <div className={styles.dropdown}>
                        {
                          currentSDK ? (
                            <>
                              { selectedSDKLogo && <img className={styles['dropdown-logo']} src={selectedSDKLogo} alt='logo' /> }
                              <span className={styles['dropdown-text']}>
                                { currentSDK }
                              </span>
                            </>
                          ) : (
                            <FormattedMessage id='common.dropdown.placeholder' />
                          )
                        }
                      </div>
                    }
                  >
                    <Dropdown.Menu className={styles['dropdown-menu']}>
                      {
                        (eventInfo?.eventType !== PAGE_VIEW && eventInfo?.eventType !== CLICK) && (
                          <>
                            <Dropdown.Header content={intl.formatMessage({id: 'connect.second.server.sdks'})} />
                            <Dropdown.Divider />
                            {
                              SERVER_SIDE_SDKS.map((sdk: IOption) => {
                                return (
                                  <Dropdown.Item
                                    key={sdk.name}
                                    onClick={() => {
                                      saveCurrentSDK(sdk.name as SdkLanguage);
                                    }}
                                  >
                                    <div className={styles['sdk-item']}>
                                      <img className={styles['sdk-logo']} src={sdk.logo} alt='logo' />
                                      { sdk.name }
                                    </div>
                                  </Dropdown.Item>
                                );
                              })
                            }
                          </>
                        )
                      }
                      <Dropdown.Header content={intl.formatMessage({id: 'connect.second.client.sdks'})} />
                        <Dropdown.Divider />
                        {
                          clientAvailability && (
                            (eventInfo?.eventType === PAGE_VIEW || eventInfo?.eventType === CLICK) 
                            ? CLIENT_SIDE_AUTO_REPORT_SDKS 
                            : CLIENT_SIDE_SDKS
                          ).map((sdk: IOption) => {
                            return (
                              <Dropdown.Item
                                key={sdk.name}
                                onClick={() => {
                                  saveCurrentSDK(sdk.name as SdkLanguage);
                                }}
                              >
                                <div className={styles['sdk-item']}>
                                  { sdk.logo && <img className={styles['sdk-logo']} src={sdk.logo} alt='logo' /> }
                                  { sdk.name }
                                </div>
                              </Dropdown.Item>
                            );
                          })
                        }
                        {
                          !clientAvailability && (
                            <div className={styles['client-sdk-usage']}>
                              <Icon type='warning-circle' customclass={styles['warning-circle']}></Icon>
                              <FormattedMessage id='connect.first.client.sdk.tip' />
                            </div>
                          )
                        }
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Field>
                <Button 
                  primary 
                  type='submit'
                  className={styles.save}
                  disabled={!currentSDK}
                  onClick={() => {
                    saveStep(currentSDK);
                  }}
                >
                  <FormattedMessage id='connect.save.continue.button' />
                </Button>
              </Form>
            )
          }
          {
            currentStep > CURRENT && (
              <div className={styles.card}>
                <div className={styles['card-left']}>
                  {
                    selectedSDKLogo && <img className={styles['dropdown-logo']} src={selectedSDKLogo} alt='logo' />
                  }
                  <div className={styles['dropdown-text']}>
                    { currentSDK }
                  </div>
                </div>
                <div className={styles['card-right']}>
                  <Icon 
                    type='edit' 
                    customclass={styles.iconfont}
                    onClick={() => {
                      goBackToStep(CURRENT);
                    }} 
                  />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SelectSDK;
