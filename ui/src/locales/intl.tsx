import { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { I18NContainer } from 'hooks';
import dayjs from 'dayjs';
import zh_CN from './zh-CN.json';
import en_US from './en-US.json';

interface IProps {
  children: ReactElement
}

const Intl = (props: IProps) => {
  const { children } = props;

  const {
    i18n,
  } = I18NContainer.useContainer();

  const chooseLocale = (val: string) => {
    const _val = val || navigator.language;
    switch (_val) {
      case 'en-US':
        dayjs.locale('en');
        return en_US;
      case 'zh-CN':
        dayjs.locale('zh-CN');
        return zh_CN;
      default:
        return en_US;
    }
  };
  
  return (
    <IntlProvider
      locale={i18n}
      messages={chooseLocale(i18n)}
    >
      {children}
    </IntlProvider>
  );
};

export default Intl;