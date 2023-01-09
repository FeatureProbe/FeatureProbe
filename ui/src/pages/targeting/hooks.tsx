import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { ICondition, IRule, IServe, IVariation } from 'interfaces/targeting';
import { ISegmentList } from 'interfaces/segment';
import { DATETIME_TYPE, SEGMENT_TYPE } from 'components/Rule/constants';
import { getVariationName } from 'utils/tools';
import { useIntl } from 'react-intl';

export const useVarition = () => {
  const [variations, saveVariations] = useState<IVariation[]>([]);
  const name = getVariationName(variations);

  const handleAdd = () => {
    variations.push({
      id: uuidv4(),
      value: '',
      name,
      description: '',
    });
    saveVariations([...variations]);
  };

  const handleDelete = (index: number) => {
    variations.splice(index, 1);
    saveVariations([...variations]);
  };

  const handleInput = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps) => {
    const { value, index, customname } = detail;
    if (variations[index]) {
      // @ts-ignore any compatibility
      variations[index][customname] = value;
    }
    saveVariations([...variations]);
  };

  const handleChangeVariation = (index: number, value: string) => {
    if (variations[index]) {
      variations[index]['value'] = value;
    }

    saveVariations([...variations]);
  };

  return { 
    variations, 
    saveVariations, 
    handleAdd, 
    handleDelete, 
    handleInput,
    handleChangeVariation
  };
};

export const useRule = () => {
  const intl = useIntl();

  const [rules, saveRules] = useState<IRule[]>([]);

  const handleAddRule = () => {
    const rule: IRule = {
      id: uuidv4(),
      name: '',
      serve: undefined,
      conditions: [],
      active: true
    };
    rules.push(rule);
    saveRules([...rules]);
  };

  const handleDeleteRule = (index: number) => {
    rules.splice(index, 1);
    saveRules([...rules]);
  };

  const handleInputRuleName = (ruleIndex: number, name: string) => {
    rules[ruleIndex].name = name;
    saveRules([...rules]);
  };

  const handleAddCondition = (index: number, type: string) => {
    const condition: ICondition = {
      id: uuidv4(),
      type: type,
      subject:  type === SEGMENT_TYPE ? intl.formatMessage({id: 'common.user.text'}) : '',
      predicate: '',
    };

    if (type === DATETIME_TYPE) {
      condition.datetime = moment().format().slice(0, 19);
      condition.timezone = moment().format().slice(-6);
    }
    rules[index].conditions.push(condition);

    saveRules([...rules]);
  };

  const handleDeleteCondition = (ruleIndex: number, conditionIndex: number) => {
    rules[ruleIndex].conditions.splice(conditionIndex, 1);
    saveRules([...rules]);
  };

  const handleChangeAttr = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].subject = value;
    saveRules([...rules]);
  };

  const handleChangeOperator = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].predicate = '' + value;
    saveRules([...rules]);
  };

  const handleChangeValue = (ruleIndex: number, conditionIndex: number, value: string[]) => {
    rules[ruleIndex].conditions[conditionIndex].objects = value;
    saveRules([...rules]);
  };

  const handleChangeDateTime = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].datetime = value;
    saveRules([...rules]);
  };

  const handleChangeTimeZone = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].timezone = value;
    saveRules([...rules]);
  };

  const handleChangeType = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].type = value;
    saveRules([...rules]);
  };

  const handleChangeServe = (ruleIndex: number, item: IServe) => {
    rules[ruleIndex].serve = item;
    saveRules([...rules]);
  };

  const handleChangeActive = (ruleIndex: number) => {
    saveRules((rules) => {
      rules[ruleIndex].active = !rules[ruleIndex].active;
      return [...rules];
    });
  };

  return { 
    rules,
    saveRules,
    handleAddRule, 
    handleDeleteRule, 
    handleInputRuleName,
    handleAddCondition,
    handleDeleteCondition,
    handleChangeAttr,
    handleChangeType,
    handleChangeOperator,
    handleChangeValue,
    handleChangeDateTime,
    handleChangeTimeZone,
    handleChangeServe,
    handleChangeActive,
  };
};

export const useDefaultServe = () => {
  const [defaultServe, saveDefaultServe] = useState<IServe>({});

  return {
    defaultServe,
    saveDefaultServe,
  };
};

export const useDisabledServe = () => {
  const [disabledServe, saveDisabledServe] = useState<IServe>({});

  return {
    disabledServe,
    saveDisabledServe,
  };
};

export const useSegment = () => {
  const [segmentList, saveSegmentList] = useState<ISegmentList>();

  return {
    segmentList,
    saveSegmentList,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};

export const useBeforeUnload = (enabled: boolean, message: string) => {
  const handler = useCallback((event: BeforeUnloadEvent) => {
    event.preventDefault();
    if (message) {
      event.returnValue = message;
    }
    return message;
  }, [message]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.addEventListener('beforeunload', handler, false);

    return () => {
      window.removeEventListener('beforeunload', handler, false);
    };
  }, [enabled, handler]);
};
