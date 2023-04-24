import { ReactElement, SyntheticEvent, useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';

import styles from './index.module.scss';

interface IProps {
  handleConfirm(): void
  handleClear(): void
  selected?: boolean;
  children: ReactElement;
  customStyle?: React.CSSProperties;
}

const Filter = (props: IProps) => {
  const { selected, children, customStyle, handleConfirm, handleClear } = props;
  const [ popupOpen, savePopupOpen ] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => {
      if (popupOpen) {
        savePopupOpen(false);
      }
    };
    window.addEventListener('click', handler);
  }, [popupOpen]);

  return (
    <Popup
      basic
      open={popupOpen}
      on='click'
      position='bottom right'
      className={styles.popup}
      style={customStyle}
      trigger={
        <Icon 
          type='filter' 
          customclass={`${styles['icon-filter']} ${selected && styles['icon-filter-selected']}`} 
          onClick={(e: SyntheticEvent) => {
            document.body.click();
            e.stopPropagation();
            savePopupOpen(true);
          }} 
        />
      }
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
        <div className={styles['popup-footer']}>
          <span className={styles['popup-footer-clear']} 
            onClick={() => { 
              handleClear();
            }}
          >
            <FormattedMessage id='common.clear.text' />
          </span>
          <span 
            className={styles['popup-footer-confirm']} 
            onClick={() => {
              handleConfirm();
              savePopupOpen(false);
            }}
          >
            <FormattedMessage id='common.confirm.text' />
          </span>
        </div>
      </div>
    </Popup>
  );
};

export default Filter;



