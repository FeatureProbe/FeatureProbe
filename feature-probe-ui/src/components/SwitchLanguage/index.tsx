import { SyntheticEvent, useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import Icon from 'components/Icon';
import { I18NContainer } from 'hooks';
import styles from './index.module.scss';

const SwitchLanguage = () => {
  const [ i18nMenuOpen, setI18nMenuOpen ] = useState<boolean>(false);
  const {
    i18n,
    setI18n
  } = I18NContainer.useContainer();

  useEffect(() => {
    const handler = () => {
      if (i18nMenuOpen) {
        setI18nMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [i18nMenuOpen]);

  return (
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
  );
};

export default SwitchLanguage;