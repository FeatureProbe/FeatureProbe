import en_US from '../../locales/en-US.json';
import { IntlProvider } from 'react-intl';

export const IntlWrapper: React.FC = ({ children }) => {
  return (
    <IntlProvider locale="en" messages={en_US}>{children}</IntlProvider>
  );
};
