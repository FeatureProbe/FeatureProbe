import { useState, useCallback } from 'react';
import { Accordion } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import RuleTitle from './RuleTitle';
import RuleContent from './RuleContent';
import Icon from 'components/Icon';
import { IOption, IRule } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';

import styles from './index.module.scss';

interface IProps {
  rule: IRule,
  index: number;
  disabled?: boolean;
  useSegment?: boolean;
  subjectOptions: IOption[];
  variationContainer?: IContainer;
  ruleContainer: IContainer;
  hooksFormContainer: IContainer;
  segmentContainer?: IContainer;
  active?: boolean;
}

const Rule = (props: IProps) => {
  const { 
    rule, 
    index,
    disabled,
    useSegment,
    ruleContainer,
    subjectOptions,
    variationContainer,
    hooksFormContainer,
    segmentContainer,
    active,
  } = props;

  const [ isHover, setHover ] = useState<boolean>(false);

  const {
    handleChangeActive,
  } = ruleContainer.useContainer();

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const handleTitleClick = useCallback(() => {
    handleChangeActive(index);
  }, [handleChangeActive, index]);

	return (
    <Draggable draggableId={`rule_${rule.id}`} index={index} isDragDisabled={disabled}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.rule} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Accordion
              activeIndex={active ? 0 : -1}
              panels={[{
                key: rule.id,
                title: {
                  className: styles['rule-accordion-title'],
                  icon: (
                    !active 
                      ? <Icon customclass={styles['icon-accordion']} type='angle-right' />
                      : <Icon customclass={styles['icon-accordion']} type='angle-down' />
                  ),
                  content: (
                    <RuleTitle
                      rule={rule}
                      index={index}
                      isHover={isHover}
                      disabled={disabled}
                      ruleContainer={ruleContainer}
                      hooksFormContainer={hooksFormContainer}
                    />
                  ),
                },
                content: {
                  content: (
                    <RuleContent
                      rule={rule}
                      ruleIndex={index}
                      disabled={disabled}
                      useSegment={useSegment}
                      subjectOptions={subjectOptions}
                      ruleContainer={ruleContainer}
                      segmentContainer={segmentContainer}
                      variationContainer={variationContainer}
                      hooksFormContainer={hooksFormContainer}
                    />
                  ),
                },
              }]}
              onTitleClick={handleTitleClick}
            >
            </Accordion>
          </div>
        </div>
      )}
    </Draggable>
	);
};

export default Rule;