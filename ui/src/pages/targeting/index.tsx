import {
  useCallback,
  useEffect,
  useState,
  SyntheticEvent,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { Form, Radio, CheckboxProps, Loader } from 'semantic-ui-react';
import { Prompt } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import Rules from './components/Rules';
import DefaultRule from './components/DefaultRule';
import DisabledServe from './components/DisabledServe';
import { useBeforeUnload } from './hooks';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Variations from 'components/Variations';
import Prerequisite from './components/Prerequisite';
import SectionTitle from 'components/SectionTitle';
import EventTracker from 'components/EventTracker';
import { replaceSpace } from 'utils/tools';
import {
  variationContainer,
  ruleContainer,
  defaultServeContainer,
  disabledServeContainer,
  hooksFormContainer,
  segmentContainer,
  prerequisiteContainer,
} from './provider';
import { VariationColors } from 'constants/colors';
import {
  IApprovalInfo,
  ICondition,
  IPrerequisite,
  IRule,
  ITarget,
  ITargeting,
  IToggleInfo,
  IVariation,
} from 'interfaces/targeting';
import { ISegmentList } from 'interfaces/segment';
import { DATETIME_TYPE, SEGMENT_TYPE } from 'components/Rule/constants';
import SizeTips from 'components/SizeTips';
import UserGuide from './components/UserGuide';
import PublishModal from './components/PublishModal';
import { useFormErrorScrollIntoView } from 'hooks';
import { getBytes, MAX_SIZE } from 'utils/bytes';

import styles from './index.module.scss';

interface IProps {
  disabled?: boolean;
  targeting?: ITarget;
  toggleInfo?: IToggleInfo;
  approvalInfo?: IApprovalInfo;
  toggleDisabled: boolean;
  trackEvents: boolean;
  latestVersion: number;
  allowEnableTrackEvents: boolean;
  initialTargeting?: ITargeting;
  segmentList?: ISegmentList;
  prerequisiteToggles?: IToggleInfo[];
  initTargeting(): void;
  saveToggleDisable(status: boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Targeting = forwardRef((props: IProps, ref: any) => {
  const {
    disabled,
    toggleInfo,
    approvalInfo,
    targeting,
    toggleDisabled,
    initialTargeting,
    segmentList,
    trackEvents,
    latestVersion,
    allowEnableTrackEvents,
    prerequisiteToggles,
    initTargeting,
    saveToggleDisable,
  } = props;
  const { rules, saveRules } = ruleContainer.useContainer();
  const { variations } = variationContainer.useContainer();
  const { defaultServe } = defaultServeContainer.useContainer();
  const { disabledServe } = disabledServeContainer.useContainer();
  const { prerequisites } = prerequisiteContainer.useContainer();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ publishDisabled, setPublishDisabled ] = useState<boolean>(true);
  const [ publishTargeting, setPublishTargeting ] = useState<ITargeting>();
  const [ isLoading, setLoading ] = useState<boolean>(false);
  const [ size, saveSize ] = useState<number>(0);
  const [ sizeConfirm, setSizeConfirm ] = useState<boolean>(false);
  const intl = useIntl();
  const formRef = useRef();

  useBeforeUnload(!publishDisabled, intl.formatMessage({ id: 'targeting.page.leave.text' }));
  useImperativeHandle(ref, () => publishDisabled, [publishDisabled]);

  const {
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = hooksFormContainer.useContainer();

  const { saveSegmentList } = segmentContainer.useContainer();

  const { scrollToError, setBeforeScrollCallback } = useFormErrorScrollIntoView(errors);

  useEffect(() => {
    setBeforeScrollCallback((names: string[]) => {
      names.forEach((name) => {
        if (name.startsWith('rule')) {
          const id = name.split('_')[1];
          for (let i = 0; i < rules.length; i++) {
            if (rules[i].id === id) {
              saveRules((rules: IRule[]) => {
                rules[i].active = true;
                return [...rules];
              });
              return;
            }
          }
        }
      });
    });
  }, [setBeforeScrollCallback, rules, saveRules]);

  useEffect(() => {
    saveSegmentList(segmentList);
  }, [segmentList, saveSegmentList]);

  useEffect(() => {
    rules.forEach((rule: IRule) => {
      if (rule.serve && Object.prototype.hasOwnProperty.call(rule.serve, 'select')) {
        if (Number(rule?.serve?.select) < variations.length) {
          setValue(`rule_${rule.id}_serve`, rule.serve);
        }
      } else {
        setValue(`rule_${rule.id}_serve`, rule.serve);
      }

      rule.conditions?.forEach((condition: ICondition) => {
        if (condition.type === 'segment') {
          setValue(`rule_${rule.id}_condition_${condition.id}_subject`, condition.predicate);
        } else {
          setValue(`rule_${rule.id}_condition_${condition.id}_subject`, condition.subject);
        }
        setValue(`rule_${rule.id}_condition_${condition.id}_predicate`, condition.predicate);

        if (condition.type === DATETIME_TYPE) {
          if (condition.objects) {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, condition.objects[0].slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, condition.objects[0].slice(19));
          } else {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, moment().format().slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, moment().format().slice(19));
          }
        } else {
          setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
        }
      });
    });
  }, [rules, variations, setValue]);

  useEffect(() => {
    if (targeting) {
      variations.forEach((variation: IVariation) => {
        setValue(`variation_${variation.id}_name`, variation.name);
        setValue(`variation_${variation.id}`, variation.value);
      });

      if (
        disabledServe &&
        Object.prototype.hasOwnProperty.call(disabledServe, 'select') &&
        Number(disabledServe?.select) < variations.length
      ) {
        setValue('disabledServe', disabledServe);
      }
      if (defaultServe && (typeof defaultServe.select !== 'undefined' || typeof defaultServe.split !== 'undefined')) {
        setValue('defaultServe', defaultServe);
      }
    }
  }, [variations, targeting, defaultServe, disabledServe, setValue]);

  useEffect(() => {
    if (targeting) {
      prerequisites.forEach((prerequisite: IPrerequisite) => {
        setValue(`prerequisite_${prerequisite.id}_toggle`, prerequisite.key);
        setValue(`prerequisite_${prerequisite.id}_returnValue`, prerequisite.value);
      });
    }
  }, [prerequisites, setValue, targeting]);

  useEffect(() => {
    const requestRules = cloneDeep(rules);
    requestRules.forEach((rule: IRule) => {
      rule.conditions.forEach((condition: ICondition) => {
        delete condition.id;
        if (condition.type === SEGMENT_TYPE) {
          delete condition.subject;
        } else if (condition.type === DATETIME_TYPE) {
          const result = [];
          result.push('' + condition.datetime + condition.timezone);
          condition.objects = result;
          delete condition.datetime;
          delete condition.timezone;
        }
      });
      delete rule.id;
      delete rule.active;
    });

    const requestVariations = cloneDeep(variations);
    requestVariations.forEach((variation: IVariation) => {
      delete variation.id;
    });

    const requestPrerequisites = cloneDeep(prerequisites) ?? [];
    requestPrerequisites.forEach((prerequisite: IPrerequisite) => {
      delete prerequisite.id;
    });

    setPublishTargeting({
      disabled: toggleDisabled,
      content: {
        rules: requestRules,
        disabledServe,
        defaultServe,
        variations: requestVariations,
        prerequisites: requestPrerequisites,
      },
    });
   
  }, [toggleDisabled, rules, variations, defaultServe, disabledServe, prerequisites]);

  useEffect(() => {
    if (initialTargeting) {
      const isSame = isEqual(publishTargeting, initialTargeting);
      setPublishDisabled(isSame);
    }
  }, [publishTargeting, initialTargeting]);

  const validateForm = useCallback(() => {
    let isError = false;

    const copyRules: IRule[] = cloneDeep(rules);
    copyRules.forEach((rule: IRule) => {
      if (rule.conditions.length === 0) {
        setError(`rule_${rule.id}_add`, {
          message: intl.formatMessage({ id: 'common.input.placeholder' }),
        });
        isError = true;
      }
    });

    const clonevariations: IVariation[] = cloneDeep(variations);
    clonevariations.forEach((variation: IVariation) => {
      const res = replaceSpace(variation);
      if (res.value === '') {
        if (toggleInfo?.returnType === 'boolean') {
          setError(`variation_${variation.id}_normal`, {
            message: intl.formatMessage({id: 'toggles.returntype.placeholder'}),
          });
        } else {
          setError(`variation_${variation.id}`, {
            message: intl.formatMessage({id: 'common.input.placeholder'}),
          });
        }
        isError = true;
      }
    });

    return isError;
  }, [intl, rules, setError, toggleInfo, variations]);

  //Check if the size of the data is too large
  useEffect(() => {
    if(publishTargeting) {
      const bytes = getBytes(JSON.stringify(publishTargeting.content));
      saveSize(bytes);
    }
  }, [publishTargeting]);

  const sizeState = useMemo(() => {
    let state = 'normal';
    if(size >= MAX_SIZE) {
      state = 'large';
    } else if(size > MAX_SIZE * 0.8) {
      state = 'near';
    }
    return state;
  }, [size]);

  const onSubmit = useCallback(() => {
    if (validateForm()) {
      return;
    }
    if(sizeState === 'large') {
      message.error(intl.formatMessage({id: 'targeting.size.tips'}, { size: Math.floor(size / 1024) }));
      return;
    }
    setOpen(true);
  }, [intl, size, sizeState, validateForm]);

  const onError = useCallback(() => {
    validateForm();
    scrollToError();
  }, [scrollToError, validateForm]);

  const disabledText = useMemo(() => {
    if (variations[disabledServe.select]) {
      return variations[disabledServe.select].name || variations[disabledServe.select].value;
    }
  }, [disabledServe.select, variations]);

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit, onError)} autoComplete='off' ref={formRef}>
        <div className={styles.status}>
          <div className={`${styles['joyride-status']} joyride-toggle-status`}>
            <SectionTitle title={intl.formatMessage({ id: 'targeting.status.text' })} />
            <div className={styles['toggle-status']}>
              <Radio
                size='mini'
                toggle
                checked={!toggleDisabled}
                onChange={(e: SyntheticEvent, data: CheckboxProps) => saveToggleDisable(!data.checked || false)}
                className={styles['info-toggle-status']}
                disabled={disabled}
              />
            </div>
            {
              toggleDisabled ? (
                <div className={styles['status-text']}>
                  <span>
                    <FormattedMessage id='targeting.status.disabled.text' />
                  </span>
                  <span
                    className={styles['name-color']}
                    style={{ background: VariationColors[Number(disabledServe.select) % 20] }}
                  ></span>
                  <span className={styles['name-text']}>{disabledText}</span>
                </div>
              ) : (
                <div className={styles['status-text']}>
                  <FormattedMessage id='common.enabled.text' />
                </div>
              )
            }
          </div>
        </div>
        <div className={styles.prerequisite}>
          <SectionTitle
            title={intl.formatMessage({ id: 'common.prerequisite.text' })}
            showTooltip={true}
            tooltipText={intl.formatMessage({ id: 'common.prerequisite.description' })}
          />
          <Prerequisite
            disabled={disabled}
            prerequisiteToggles={prerequisiteToggles}
          />
        </div>
        <div className={styles.variations}>
          <SectionTitle
            title={intl.formatMessage({ id: 'common.variations.text' })}
            showTooltip={true}
            tooltipText={intl.formatMessage({ id: 'toggles.variations.tips' })}
          />
          <Variations
            disabled={disabled}
            returnType={toggleInfo?.returnType || ''}
            hooksFormContainer={hooksFormContainer}
            variationContainer={variationContainer}
            ruleContainer={ruleContainer}
            defaultServeContainer={defaultServeContainer}
          />
        </div>
        <div className={styles.rules}>
          <Rules
            disabled={disabled}
            useSegment={true}
            ruleContainer={ruleContainer}
            variationContainer={variationContainer}
            hooksFormContainer={hooksFormContainer}
            segmentContainer={segmentContainer}
          />
          <DefaultRule disabled={disabled} />
        </div>
        <div className={styles['disabled-return']}>
          <DisabledServe disabled={disabled} />
        </div>
        <div id='footer' className={styles.footer}>
          <EventTracker category='targeting' action='publish-toggle'>
            <Button
              className={styles['publish-btn']}
              disabled={publishDisabled || disabled || isLoading}
              primary
              type='submit'
            >
              {isLoading && <Loader inverted active inline size='tiny' className={styles['publish-btn-loader']} />}
              <span className={styles['publish-btn-text']}>
                {approvalInfo?.enableApproval ? (
                  <FormattedMessage id='common.request.approval.text' />
                ) : (
                  <FormattedMessage id='common.publish.text' />
                )}
              </span>
            </Button>
          </EventTracker>
        </div>
        <PublishModal
          open={open}
          approvalInfo={approvalInfo}
          trackEvents={trackEvents}
          allowEnableTrackEvents={allowEnableTrackEvents}
          publishTargeting={publishTargeting}
          initialTargeting={initialTargeting}
          latestVersion={latestVersion}
          setOpen={setOpen}
          setLoading={setLoading}
          initTargeting={initTargeting}
        />
        <Prompt when={!publishDisabled} message={intl.formatMessage({ id: 'targeting.page.leave.text' })} />
        <UserGuide />
      </Form>
      <SizeTips
        hide={sizeConfirm || sizeState === 'normal'}
        size={size}
        onConfirm={() => {
          setSizeConfirm(true);
        }}
      />
    </div>
  );
});

export default Targeting;
