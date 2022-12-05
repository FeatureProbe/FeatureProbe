import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import PopConfirm from 'components/PopupConfirm'; 
import Icon from 'components/Icon';
import { IRule } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import styles from './index.module.scss';

interface IProps {
  rule: IRule;
  index: number;
  disabled?: boolean;
  isHover: boolean;
  ruleContainer: IContainer;
  hooksFormContainer: IContainer;
}

const RuleTitle = (props: IProps) => {
  const { 
    rule, 
    index,
    disabled,
    isHover,
    ruleContainer,
    hooksFormContainer,
  } = props;

  const intl = useIntl();
  const [open, setOpen] = useState<boolean>(false);

  const {
    handleDeleteRule,
    handleInputRuleName,
  } = ruleContainer.useContainer();

  const {
    unregister,
    clearErrors,
    getValues,
  } = hooksFormContainer.useContainer();

  useEffect(() => {
    if (!isHover) {
      setOpen(false);
    }
  }, [isHover]);
  
  const handleDelete = useCallback((e: SyntheticEvent, index: number, ruleId?: string) => {
    e.stopPropagation();

    for(const key in getValues()) {
      if (key.startsWith(`rule_${ruleId}_`)) {
        unregister(key);
        clearErrors(key);
      }
    }
    handleDeleteRule(index);
  }, [unregister, clearErrors, getValues, handleDeleteRule]);

  const handleInputClick = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const handleChange = useCallback((e: SyntheticEvent, data: InputOnChangeData) => {
    handleInputRuleName(index, data.value);
  }, [index, handleInputRuleName]);

	return (
    <div className={styles['rule-title']}>
      <Form.Group className={styles['rule-title-input']} widths='equal'>
        <Form.Field>
          <Form.Input
            className={styles['rule-input']}
            onClick={handleInputClick} 
            value={rule.name} 
            disabled={disabled}
            placeholder={`${intl.formatMessage({id: 'common.rule.text'})}${index + 1}`}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (detail.value.length > 50 ) return;
              handleChange(e, detail);
            }}
          />
        </Form.Field>
      </Form.Group>
      {
        isHover && !disabled && (
          <span className={styles['rule-title-operation']}>
            <Icon customclass={styles['icon-drag']} type='drag' />
            <PopConfirm
              open={open}
              handleConfirm={(e: SyntheticEvent) => {
                e.stopPropagation();
                handleDelete(e, index, rule.id);
                setOpen(false);
              }}
              handleCancel={(e: SyntheticEvent) => {
                e.stopPropagation();
                setOpen(false);
              }}
              text={intl.formatMessage({id: 'targeting.rule.delete.text'})}
            >
              <Icon 
                type='archive' 
                customclass={styles['icon-archive']} 
                onClick={(e: SyntheticEvent) => {
                  setOpen(true);
                  e.stopPropagation();
                }}
              />
            </PopConfirm>
          </span>
        )
      }
    </div>
	);
};

export default RuleTitle;