import { FormattedMessage, useIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import classNames from 'classnames';
import Button from 'components/Button';
import Serve from 'components/Serve';
import Icon from 'components/Icon';
import Condition from './condition';
import { IRule, ICondition, IOption } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import { STRING_TYPE, NUMBER_TYPE, SEMVER_TYPE, DATETIME_TYPE, SEGMENT_TYPE } from './constants';
import styles from './index.module.scss';

interface IProps {
  rule: IRule;
  ruleIndex: number;
  disabled?: boolean;
  useSegment?: boolean;
  ruleContainer: IContainer;
  subjectOptions: IOption[];
  variationContainer?: IContainer;
  segmentContainer?: IContainer;
  hooksFormContainer: IContainer;
}

const RuleContent = (props: IProps) => {
  const {
    rule,
    disabled,
    ruleIndex,
    useSegment,
    ruleContainer,
    subjectOptions,
    segmentContainer,
    variationContainer,
    hooksFormContainer,
  } = props;

  const intl = useIntl();

  let variations;

  if (variationContainer) {
    variations = variationContainer.useContainer().variations;
  }

  const {
    handleAddCondition,
    handleChangeServe,
  } = ruleContainer.useContainer();

  const ruleAddCls = classNames(
    {
      [styles['rule-add']]: rule.conditions.length > 0
    },
    {
      [styles['rule-add-one']]: rule.conditions.length === 0
    }
  );

	return (
    <div className={styles['rule-content']}>
      {
        rule.conditions?.map((condition: ICondition, index: number) => {
          return (
            <Condition
              key={condition.id}
              rule={rule}
              disabled={disabled}
              ruleIndex={ruleIndex}
              useSegment={useSegment}
              conditionIndex={index}
              condition={condition}
              subjectOptions={subjectOptions}
              ruleContainer={ruleContainer}
              segmentContainer={segmentContainer}
              variationContainer={variationContainer}
              hooksFormContainer={hooksFormContainer}
            />
          );
        })
      }

      <div className={ruleAddCls}>
        <Popup
          basic
          hoverable
          disabled={disabled}
          position='bottom right'
          className={styles.popup}
          trigger={
            <Button type='button' secondary className={styles['rule-add-btn']} disabled={disabled}>
              <Icon type='add' customclass={styles.iconfont} />
              <FormattedMessage id='common.add.text' />
            </Button>
          }
        >
          <div className={styles['menu']}>
            <div className={styles['menu-item-centering']} onClick={()=> {handleAddCondition(ruleIndex, STRING_TYPE);}}>
              {intl.formatMessage({id: `targeting.rule.operator.type.${STRING_TYPE}`})}
            </div>
            <div className={styles['menu-item-centering']} onClick={()=> {handleAddCondition(ruleIndex, NUMBER_TYPE);}}>
              {intl.formatMessage({id: `targeting.rule.operator.type.${NUMBER_TYPE}`})}
            </div>
            <div className={styles['menu-item-centering']} onClick={()=> {handleAddCondition(ruleIndex, DATETIME_TYPE);}}>
              {intl.formatMessage({id: `targeting.rule.operator.type.${DATETIME_TYPE}`})}
            </div>
            <div className={styles['menu-item-centering']} onClick={()=> {handleAddCondition(ruleIndex, SEMVER_TYPE);}}>
              {intl.formatMessage({id: `targeting.rule.operator.type.${SEMVER_TYPE}`})}
            </div>
            {
              useSegment && (
                <div className={styles['menu-item-centering']} onClick={()=> {handleAddCondition(ruleIndex, SEGMENT_TYPE);}}>
                  {intl.formatMessage({id: `targeting.rule.operator.type.${SEGMENT_TYPE}`})}
                </div>
              )
            }
          </div>
        </Popup>
      </div>

      {
        variations && (
          <Serve
            index={ruleIndex}
            id={rule.id}
            disabled={disabled}
            serve={rule.serve}
            variations={variations}
            customStyle={{width: '308px'}}
            handleChangeServe={(item) => handleChangeServe(ruleIndex, item)}
            hooksFormContainer={hooksFormContainer}
          />
        )
      }
    </div>
	);
};

export default RuleContent;