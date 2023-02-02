import { FormattedMessage, useIntl } from 'react-intl';
import SectionTitle from 'components/SectionTitle';
import NoData from 'components/NoData';
import Button from 'components/Button';
import { IEvent } from 'interfaces/analysis';

import styles from './index.module.scss';
import Icon from 'components/Icon';

interface IProps {
  eventInfo?: IEvent;
}

const Results = (props: IProps) => {
  const { eventInfo } = props;

  const intl = useIntl();
  const time = '2022-02-09 22:22:22';
  // const [ time, saveTime ] = useState<string>('2022-02-09 22:22:22');

  return (
    <div className={styles.result}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.data.text'})}
        showTooltip={false}
      />
      <div className={styles.start}>
        <span className={styles['start-time']}>开始收集时间： {time}</span>
        <Button primary className={styles['start-btn']}>
          收集数据
        </Button>
      </div>

      {
        eventInfo ? (
          <div>有数据</div>
        ) : (
          <div>
            <div className={styles.tips}>
              <Icon customclass={styles['warning-circle']} type='warning-circle' />
              <FormattedMessage id='请先保存“指标信息”，并点击【收集数据】' />
            </div> 
            <NoData />
          </div>
        )
      }
    </div>
  );
};

export default Results;
  