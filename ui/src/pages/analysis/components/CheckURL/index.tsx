import { useState, SyntheticEvent, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, InputOnChangeData, Popup } from 'semantic-ui-react';
import { findIndex } from 'lodash';
import TextLimit from 'components/TextLimit';
import { matchUrl } from 'utils/checkUrl';
import Icon from 'components/Icon';
import { getUrlMatchOptions } from '../option';

import styles from './index.module.scss';

interface IProps {
  metricUrl: string;
  metricMatcher: string;
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckURL = (props: IProps) => {
  const { metricUrl, metricMatcher, popupOpen, setPopupOpen } = props;
  const [ isLegal, saveIsLegal ] = useState<boolean>(false);
  const [ checkUrl, saveCheckUrl ] = useState<string>('');

  const intl = useIntl();

  useEffect(() => {
    if (!popupOpen) {
      saveCheckUrl('');
    }
  }, [popupOpen]);

  const getMatcherText = useCallback((key: string) => {
    const urlMatchOption = getUrlMatchOptions();
    return urlMatchOption[findIndex(urlMatchOption, {value: key})].text;
  }, []);

  return (
    <Popup
      hideOnScroll
      open={popupOpen}
      on='click'
      position='bottom right'
      className={styles['test-url-popup']}
      trigger={
        <div 
          className={styles['test-url-text']} 
          onClick={(e: SyntheticEvent) => {
            document.body.click();
            e.stopPropagation();
            setPopupOpen(true);
          }}
        >
          <FormattedMessage id='analysis.event.target.url.test' />
        </div>
      }
      onClick={(e: SyntheticEvent) => {
        e.stopPropagation();
      }}
    >
      <div className={styles['test-url-popup-content']}>
        <div className={styles['test-url-popup-title']}>
          {getMatcherText(metricMatcher)}
          <span className={styles['test-url-popup-divider']}>:</span>
          <TextLimit text={metricUrl ?? ''} maxWidth={220} />
        </div>
        <Form>
          <Form.Input
            className={styles['test-url-popup-url']}
            value={checkUrl}
            placeholder={intl.formatMessage({id: 'analysis.event.target.url.placeholder'})}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              e.stopPropagation();
              saveCheckUrl(detail.value);
              saveIsLegal(matchUrl(metricMatcher, metricUrl, detail.value));
            }}
          />
        </Form>
        {
          checkUrl && (
            <div>
              {
                isLegal ? (
                  <div className={styles['test-url-success']}>
                    <Icon type='success-circle' customclass={styles['test-url-success-icon']} />
                    <FormattedMessage id='analysis.event.target.url.match' />
                  </div>
                ) : (
                  <div className={styles['test-url-error']}>
                    <Icon type='error-circle' customclass={styles['test-url-error-icon']} />
                    <FormattedMessage id='analysis.event.target.url.not.match' />
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </Popup>
  );
};

export default CheckURL;