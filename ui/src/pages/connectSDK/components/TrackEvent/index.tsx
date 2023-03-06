import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SyntaxHighlighter from 'react-syntax-highlighter';
import classNames from 'classnames';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Button from 'components/Button';
import Icon from 'components/Icon';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import {
  SdkLanguage,
  getJavaTrackCode,
  getRustTrackCode,
  getAndroidTrackCode,
  getSwiftTrackCode,
  getObjCTrackCode
} from '../../constants';

import styles from '../../index.module.scss';

interface IProps {
  attributes: string[];
  eventName: string;
  currentStep: number;
  currentSDK: SdkLanguage;
  saveStep(): void;
  goBackToStep(step: number): void;
}

interface ICodeOption {
  title?: string;
  name?: string;
  code: string;
}

const CURRENT = 3;

const SetupCode = (props: IProps) => {
  const {
    currentStep,
    currentSDK,
    eventName,
    saveStep, 
    goBackToStep 
  } = props;

  const [ options, saveOptions ] = useState<ICodeOption[]>([]);
  const [ language, saveLanguage ] = useState<string>('java');
  const intl = useIntl();

  const stepTitleCls = classNames(
    styles['step-title'],
    {
      [styles['step-title-selected']]: currentStep === CURRENT
    }
  );

  useEffect(() => {
    if (currentSDK) {
      switch (currentSDK) {
        case 'Java':
          saveLanguage('java');
          saveOptions(
            getJavaTrackCode({
              intl, 
              eventName,
            })
          );
          break;
        case 'Rust': 
          saveLanguage('rust');
          saveOptions(
            getRustTrackCode({
              intl, 
              eventName,
            })
          );
          break;
        case 'Android': 
          saveLanguage('java');
          saveOptions(
            getAndroidTrackCode({
              intl, 
              eventName,
            })
          );
          break;
        case 'Swift': 
          saveLanguage('swift');
          saveOptions(
            getSwiftTrackCode({
              intl, 
              eventName,
            })
          );
          break;
        case 'Objective-C':
          saveLanguage('objectivec');
          saveOptions(
            getObjCTrackCode({
              intl, 
              eventName,
            })
          );
          break;
        case 'JavaScript':
          saveLanguage('javascript');
          saveOptions(
            getJavaTrackCode({
              intl, 
              eventName,
            })
          );
          break;
        case 'React':
          saveLanguage('javascript');
          saveOptions(
            getJavaTrackCode({
              intl, 
              eventName,
            })
          );
          break;
      }
    }
  }, [currentSDK, eventName, intl]);

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
          <FormattedMessage id='设置埋点上报' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <>
                <div>
                  {
                    options.map((item: ICodeOption, index: number) => {
                      return (
                        <div key={index}>
                          {
                            item.title && (
                              <div className={styles['code-step-title']}>
                                <span className={styles['code-step-divider']}></span>
                                {item.title}
                              </div>
                            )
                          }
                          <div className={styles['code-step']}>{item.name}</div>
                          <div className={styles.code}>
                            <span className={styles.copy}>
                              <CopyToClipboardPopup text={item.code}>
                                <span className={styles['copy-btn']}>
                                  <FormattedMessage id='common.copy.uppercase.text' />
                                </span>
                              </CopyToClipboardPopup>
                            </span>
                            <SyntaxHighlighter
                              language={language}
                              style={docco}
                              wrapLongLines={true}
                              customStyle={{
                                backgroundColor: 'rgba(33,37,41,0.04)',
                                fontSize: '13px',
                                borderRadius: '6px',
                                minHeight: '36px',
                                marginTop: '0',
                                marginBottom: '12px',
                                paddingRight: '70px'
                              }}
                            >
                              {item.code}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
                <div>
                  <Button
                    primary
                    type='submit'
                    className={styles.save}
                    onClick={() => {
                      saveStep();
                    }}
                  >
                    <FormattedMessage id='connect.continue.button' />
                  </Button>
                </div>
              </>
            )
          }
          {
            currentStep > CURRENT && (
              <div className={styles.card}>
                <div className={styles['card-left']}>
                  <FormattedMessage id='设置埋点上报' />
                </div>
                <div className={styles['card-right']}>
                  <Icon
                    type='view'
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

export default SetupCode;
