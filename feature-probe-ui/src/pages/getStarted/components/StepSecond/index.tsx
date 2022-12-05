import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SyntaxHighlighter from 'react-syntax-highlighter';
import classNames from 'classnames';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useParams } from 'react-router-dom';
import Button from 'components/Button';
import Icon from 'components/Icon';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { IRouterParams } from 'interfaces/project';
import { ICondition, IRule } from 'interfaces/targeting';
import {
  ToggleReturnType,
  getAndroidCode,
  getGoCode,
  getJavaCode,
  getJSCode,
  getNodeCode,
  getObjCCode,
  getPythonCode,
  getRustCode,
  getSwiftCode,
  getMiniProgramCode,
  getReactCode,
} from '../constants';
import styles from '../Steps/index.module.scss';

export type SdkLanguage = 
    'Java'
    | 'Python'
    | 'Rust'
    | 'Go'
    | 'Node.js'
    | 'Android'
    | 'Swift'
    | 'Objective-C'
    | 'JavaScript'
    | 'Mini Program'
    | 'React';

interface IProps {
  rules: IRule[]
  currentStep: number;
  currentSDK: SdkLanguage;
  returnType: ToggleReturnType;
  sdkVersion: string;
  serverSdkKey: string;
  clientSdkKey: string;
  saveStep(): void;
  goBackToStep(step: number): void;
}

interface ICodeOption {
  title?: string;
  name?: string;
  code: string;
}

const CURRENT = 2;

const StepSecond = (props: IProps) => {
  const {
    rules,
    currentStep, 
    currentSDK, 
    serverSdkKey, 
    clientSdkKey, 
    returnType, 
    sdkVersion, 
    saveStep, 
    goBackToStep 
  } = props;

  const [ options, saveOptions ] = useState<ICodeOption[]>([]);
  const [ language, saveLanguage ] = useState<string>('java');
  const [ remoteUrl, saveRemoteUrl ] = useState<string>('http://127.0.0.1:4007');
  const { toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  const stepTitleCls = classNames(
    styles['step-title'],
    {
      [styles['step-title-selected']]: currentStep === CURRENT
    }
  );

  useEffect(() => {
    const remoteUrl = window.FP.stringValue('remote_url', '');
    saveRemoteUrl(remoteUrl);
  }, []);

  useEffect(() => {
    if (currentSDK) {
      const result: string[] = [];
      let userWithCode = '';

      rules.forEach((rule: IRule) => {
        rule.conditions.forEach((condition: ICondition) => {
          if (condition.subject && !result.includes(condition.subject)) {
            result.push(condition.subject);
          }
        });
      });

      switch (currentSDK) {
        case 'Java':
          saveLanguage('java');
          result.forEach(item => {
            userWithCode += `.with("${item}", /* ${item} */)`;
          });
          saveOptions(
            getJavaCode({
              sdkVersion, 
              serverSdkKey, 
              toggleKey, 
              returnType, 
              intl, 
              userWithCode,
              remoteUrl,
            })
          );
          break;
        case 'Python':
          saveLanguage('python');
          result.forEach(item => {
            userWithCode += `user['${item}'] = 'value for ${item}'  # or use 'user.with_attr(key, value)'\n    `;
          });
          saveOptions(
            getPythonCode({
              sdkVersion,
              serverSdkKey,
              toggleKey,
              returnType,
              intl,
              userWithCode,
              remoteUrl,
            })
          );
          break;
        case 'Rust': 
          saveLanguage('rust');
          result.forEach(item => {
            userWithCode += `let user = user.with("${item}", /* ${item} */);\n`;
          });
          saveOptions(
            getRustCode({
              sdkVersion, 
              serverSdkKey, 
              toggleKey, 
              returnType, 
              intl, 
              userWithCode,
              remoteUrl,
            })
          );
          break;
        case 'Go': 
          saveLanguage('go');
          result.forEach(item => {
            userWithCode += `user.With("${item}", /* ${item} */)\n`;
          });
          saveOptions(
            getGoCode({
              serverSdkKey, 
              toggleKey, 
              returnType, 
              intl, 
              userWithCode,
              remoteUrl,
            })
          );
          break;
        case 'Node.js':
          saveLanguage('javascript');
          result.forEach(item => {
            userWithCode += `.with('${item}', /* ${item} */)`;
          });
          saveOptions(
            getNodeCode({
              serverSdkKey,
              toggleKey,
              returnType,
              intl,
              userWithCode,
              remoteUrl,
            })
          );
          break;

        case 'Android': 
          saveLanguage('java');
          result.forEach(item => {
            userWithCode += `user.with("${item}", /* ${item} */)\n`;
          });
          saveOptions(
            getAndroidCode({
              sdkVersion, 
              clientSdkKey, 
              toggleKey, 
              returnType, 
              intl, 
              userWithCode,
              remoteUrl,
            })
          );
          break;
        case 'Swift': 
          saveLanguage('swift');
          result.forEach(item => {
            userWithCode += `user.with("${item}", /* ${item} */)\n`;
          });
          saveOptions(getSwiftCode({
            clientSdkKey, 
            toggleKey, 
            returnType, 
            intl, 
            userWithCode,
            remoteUrl,
          }));
          break;
        case 'Objective-C':
          saveLanguage('objectivec');
          result.forEach(item => {
            userWithCode += `[user withKey:@"${item}" value:/* ${item} */];\n`;
          });
          saveOptions(getObjCCode({
            clientSdkKey,
            toggleKey,
            returnType,
            intl,
            userWithCode,
            remoteUrl,
          }));
          break;
        case 'JavaScript':
          saveLanguage('javascript');
          result.forEach(item => {
            userWithCode += `user.with("${item}", /* ${item} */);\n`;
          });
          saveOptions(getJSCode({
            clientSdkKey,
            toggleKey,
            returnType,
            intl,
            userWithCode,
            remoteUrl,
          }));
          break;
        case 'Mini Program':
          saveLanguage('javascript');
          result.forEach(item => {
            userWithCode += `user.with("${item}", /* ${item} */);\n`;
          });
          saveOptions(getMiniProgramCode({
            clientSdkKey,
            toggleKey,
            returnType,
            intl,
            userWithCode,
            remoteUrl,
          }));
          break;
        case 'React':
            saveLanguage('javascript');
            result.forEach(item => {
              userWithCode += `user.with("${item}", /* ${item} */);\n  `;
            });
            saveOptions(getReactCode({
              clientSdkKey,
              toggleKey,
              returnType,
              intl,
              userWithCode,
              remoteUrl,
            }));
            break;
      }
    }
  }, [rules, sdkVersion, currentSDK, clientSdkKey, serverSdkKey, toggleKey, returnType, intl, remoteUrl]);

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
          <FormattedMessage id='connect.third.title' />
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
                  <FormattedMessage id='connect.third.title' />
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

export default StepSecond;
