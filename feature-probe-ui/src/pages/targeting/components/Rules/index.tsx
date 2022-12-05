import { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';
import SectionTitle from 'components/SectionTitle';
import Icon from 'components/Icon';
import Rule from 'components/Rule';
import { ICondition, IOption, IRule } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import styles from './index.module.scss';
import { SEGMENT_TYPE } from 'components/Rule/constants';

interface IProps {
  disabled?: boolean;
  useSegment?: boolean;
  ruleContainer: IContainer;
  variationContainer?: IContainer;
  hooksFormContainer: IContainer;
  segmentContainer?: IContainer;
}

const MAX_RULES = 30;

const Rules = (props: IProps) => {
  const intl = useIntl();
  const { 
    disabled, 
    useSegment, 
    ruleContainer, 
    variationContainer, 
    hooksFormContainer, 
    segmentContainer 
  } = props;

  const [ subjectOptions, saveSubjectOptions ] = useState<IOption[]>([]);

  const { 
    rules,
    saveRules,
    handleAddRule, 
  } = ruleContainer.useContainer();

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const copyRules = cloneDeep(rules);
    const [removed] = copyRules.splice(result.source.index, 1);
    copyRules.splice(result.destination.index, 0, removed);
    saveRules([...copyRules]);
  }, [rules, saveRules]);

  const cls = classNames(
    styles.add,
    {
      [styles['add-disabled']]: rules.length >= MAX_RULES || disabled
    }
  );

  useEffect(() => {
    const subjectOptions: IOption[] = [];
    rules.forEach((rule:IRule) => {
      if (rule.conditions) {
        rule.conditions.forEach((condition: ICondition) => {
          const index = subjectOptions.findIndex((item) => {
            return item.key === condition.subject;
          });

          if (index === -1 && condition.subject && condition.type !== SEGMENT_TYPE) {
            subjectOptions.push({
              key: condition.subject,
              text: condition.subject,
              value: condition.subject,
            });
          }
        });
      }
    });
    saveSubjectOptions(cloneDeep(subjectOptions));
  }, [rules]);

	return (
		<div className={styles.rules}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.rules.text'})}
        showTooltip={true}
        tooltipText={intl.formatMessage({id: 'targeting.rules.tips'})}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className={styles['rules-container']}>
                {
                  rules && rules.map((rule: IRule, index: number) => {
                    return (
                      <Rule
                        key={rule.id}
                        rule={rule}
                        index={index}
                        disabled={disabled}
                        useSegment={useSegment}
                        ruleContainer={ruleContainer}
                        subjectOptions={subjectOptions}
                        segmentContainer={segmentContainer}
                        hooksFormContainer={hooksFormContainer}
                        variationContainer={variationContainer}
                        active={rule.active}
                      />
                    );
                  })
                }
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div 
        className={cls} 
        onClick={() => {
          if (rules.length >= MAX_RULES || disabled) {
            return;
          }
          handleAddRule();
        }}
      >
        <Icon customclass={styles['iconfont']} type='add' />
        <FormattedMessage id='targeting.rule.add.text'/>
      </div>
		</div>
	);
};

export default Rules;
