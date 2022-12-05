import { useIntl } from 'react-intl';
import Serve from 'components/Serve';
import SectionTitle from 'components/SectionTitle';
import { variationContainer, defaultServeContainer, hooksFormContainer } from '../../provider';
import styles from './index.module.scss';

interface IProps {
  disabled?: boolean;
}

const DefaultRule = (props: IProps) => {
  const { disabled } = props;
  const { variations } = variationContainer.useContainer();
  const intl = useIntl();

  const { 
    defaultServe,
    saveDefaultServe,
  } = defaultServeContainer.useContainer();

  return (
    <div className={styles['default-rule']}>
      <span className={`${styles['joyride-default-rule']} joyride-default-rule`}>
        <SectionTitle
          title={intl.formatMessage({id: 'targeting.default.rule'})}
          showTooltip={true}
          tooltipText={intl.formatMessage({id: 'targeting.default.rule.tips'})}
        />
        <div className={styles['serve-select']}>
          <Serve 
            disabled={disabled}
            serve={defaultServe}
            variations={variations}
            customStyle={{width: '328px'}}
            handleChangeServe={(item) => {saveDefaultServe(item);}}
            hooksFormContainer={hooksFormContainer}
          />
        </div>
      </span>
    </div>
  );
};

export default DefaultRule;
