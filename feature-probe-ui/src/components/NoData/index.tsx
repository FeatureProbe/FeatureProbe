import { FormattedMessage } from 'react-intl';
import styles from './index.module.scss';

interface IProps {
  text?: string;
}

const NoData = (props: IProps) => {
  const { text } = props;

  return (
    <div className={styles['no-data']}>
      <div>
        <img className={styles['no-data-image']} src={require('images/no-data.png')} alt='no-data' />
      </div>
      <div>
        { text || <FormattedMessage id='common.nodata.text' />  }
      </div>
    </div>
  );
};

export default NoData;
