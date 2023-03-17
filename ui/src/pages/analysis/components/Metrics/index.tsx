import { useCallback, useState, SyntheticEvent, useEffect, useRef, useMemo } from 'react';
import { Dropdown, DropdownProps, Form, Grid, InputOnChangeData, Popup } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Joyride, { CallBackProps, EVENTS, Step, ACTIONS } from 'react-joyride';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import Icon from 'components/Icon';
import SectionTitle from 'components/SectionTitle';
import Button from 'components/Button';
import message from 'components/MessageBox';
import Loading from 'components/Loading';
import CheckURL from '../CheckURL';
import { IEvent } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { IDictionary } from 'interfaces/targeting';
import { createEvent } from 'services/analysis';
import { getFromDictionary, saveDictionary } from 'services/dictionary';
import { CUSTOM, CONVERSION, CLICK, PAGE_VIEW, COUNT, REVENUE, DURATION } from '../../constants';
import { commonConfig, floaterStyle, tourStyle } from 'constants/tourConfig';
import { USER_TRACK_EVENT } from 'constants/dictionary_keys';

import { 
  getEventTypeOptions,
  getMetricTypeOptions,
  getUrlMatchOptions,
  getWinCriteriaOptions,
  getSimpleEventTypeOptions,
} from '../option';

import styles from './index.module.scss';

interface IProps {
  eventInfo?: IEvent;
  isLoading: boolean;
  getEvent(): void;
  initTargeting(): void;
}

const STEPS: Step[] = [
  {
    content: (
      <div>
        <div className='joyride-title'>
          <FormattedMessage id='getstarted.track.event' />
        </div>
        <div className={styles['joyride-content']}>
          <FormattedMessage id='guide.connect.sdk.content' />
        </div>
      </div>
    ),
    placement: 'bottom',
    target: '.connect-sdk',
    spotlightPadding: 10,
    ...commonConfig
  },
];

const Metrics = (props: IProps) => {
  const { eventInfo, initTargeting, getEvent, isLoading } = props;

  const [ metricName, saveMetricName ] = useState<string>('');
  const [ description, saveDescription ] = useState<string>('');
  const [ metricType, saveMetricType ] = useState<string>('');
  const [ eventType, saveEventType ] = useState<string>('');
  const [ eventName, saveEventName ] = useState<string>('');
  const [ metricMatcher, saveMetricMatcher ] = useState<string>('');
  const [ metricUrl, saveMetricUrl ] = useState<string>('');
  const [ metricSelector, saveMetricSelector ] = useState<string>('');
  const [ unit, saveUnit ] = useState<string>('');
  const [ winCriteria, saveWinCriteria ] = useState<string>('');
  const [ canSave, saveCanSave ] = useState<boolean>(false);
  const [ saveLoading, setSaveLoading ] = useState<boolean>(false);
  const [ popupOpen, setPopupOpen ] = useState<boolean>(false);
  const [ initialFormValue, saveInitialFormValue ] = useState({});
  const [ run, saveRun ] = useState<boolean>(false);
  const [ stepIndex, saveStepIndex ] = useState<number>(0);
  const selectorUrl = useRef('');
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
  } = useForm();

  useEffect(() => {
    const handler = () => {
      if (popupOpen) {
        setPopupOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [popupOpen]);

  const getUserGuide = useCallback(() => {
    getFromDictionary<IDictionary>(USER_TRACK_EVENT).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        if (parseInt(savedData) !== STEPS.length) {
          setTimeout(() => {
            saveRun(true);
          }, 500);
          saveStepIndex(parseInt(savedData));
        }
      } else {
        setTimeout(() => {
          saveRun(true);
        }, 500);
      }
    });
  }, []);

  useEffect(() => {
    if(eventInfo) {
      setValue('metricName', eventInfo.name);
      setValue('description', eventInfo.description);
      setValue('metricType', eventInfo.metricType);
      setValue('eventType', eventInfo.eventType);
      setValue('winCriteria', eventInfo.winCriteria);

      saveMetricName(eventInfo.name);
      eventInfo.description && saveDescription(eventInfo.description);
      saveMetricType(eventInfo.metricType);
      saveEventType(eventInfo.eventType);
      saveWinCriteria(eventInfo.winCriteria);
    }

    if (eventInfo?.eventType === PAGE_VIEW || eventInfo?.eventType === CLICK) {
      setValue('matcher', eventInfo.matcher);
      setValue('url', eventInfo.url);
      eventInfo.url && saveMetricUrl(eventInfo.url);
      eventInfo.matcher && saveMetricMatcher(eventInfo.matcher);
    }

    if (eventInfo?.eventType === CLICK) {
      setValue('selector', eventInfo.selector);
      eventInfo.selector && saveMetricSelector(eventInfo.selector);
    }

    if (eventInfo?.eventType === CUSTOM) {
      setValue('eventName', eventInfo.eventName);
      eventInfo.eventName && saveEventName(eventInfo.eventName);
    }

    if (eventInfo?.metricType === DURATION || eventInfo?.metricType === REVENUE) {
      setValue('unit', eventInfo?.unit);
      eventInfo?.unit && saveUnit(eventInfo.unit);
    }

    saveInitialFormValue(getValues());
  }, [eventInfo, getValues, setValue]);

  useEffect(() => {
    const formValues = getValues();
    const isSame = isEqual(formValues, initialFormValue);
    saveCanSave(!isSame);
  }, [
    eventInfo,
    getValues,
    metricName,
    description,
    metricType,
    eventType,
    eventName,
    metricMatcher,
    metricSelector,
    metricUrl,
    unit,
    winCriteria,
    initialFormValue,
  ]);

  useEffect(() => {
    if (intl.locale === 'zh-CN') {
      selectorUrl.current = 'https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors';
    } else if(intl.locale === 'en-US') {
      selectorUrl.current = 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors';
    }
  }, [intl]);

  useEffect(() => {
    register('metricName', {
      required: {
        value: true,
        message: intl.formatMessage({id: 'analysis.metric.name.placeholder'})
      },
    });

    register('metricType', { 
      required: {
        value: true,
        message: intl.formatMessage({id: 'analysis.metric.kind.placeholder'})
      },
    });

    register('eventType', { 
      required: {
        value: true,
        message: intl.formatMessage({id: 'analysis.event.type.placeholder'})
      },
    });

    register('eventName', { 
      required: {
        value: eventType === CUSTOM,
        message: intl.formatMessage({id: 'analysis.event.name.placeholder'})
      },
      minLength: {
        value: 2,
        message: intl.formatMessage({id: 'common.minimum.two'})
      },
      maxLength: {
        value: 30,
        message: intl.formatMessage({id: 'common.maximum.thirty'})
      },
      pattern: {
        value: /^[A-Z0-9._-]+$/i,
        message: intl.formatMessage({id: 'common.name.invalid'})
      }
    });

    register('matcher', { 
      required: {
        value: eventType === PAGE_VIEW || eventType === CLICK,
        message: intl.formatMessage({id: 'analysis.event.target.url.matching'})
      },
    });

    register('url', { 
      required: {
        value: eventType === PAGE_VIEW || eventType === CLICK,
        message: intl.formatMessage({id: 'analysis.event.target.url.placeholder'})
      },
      validate: (value) => {
        if(metricMatcher !== 'REGULAR') {
          return true;
        }
        let isReg = true;
        try {
          new RegExp(value);
        } catch {
          isReg = false;
        }
        return isReg ? true : intl.formatMessage({id: 'analysis.event.target.url.matching.regex.error'});
      }
    });

    register('selector', { 
      required: {
        value: eventType === CLICK,
        message: intl.formatMessage({id: 'analysis.event.click.target.placeholder'})
      },
    });

    register('unit', { 
      required: {
        value: metricType === REVENUE || metricType === DURATION,
        message: intl.formatMessage({id: 'analysis.metric.unit.tips'})
      },
    });

    register('winCriteria', { 
      required: {
        value: true,
        message: intl.formatMessage({id: 'analysis.metric.win.criteria.placeholder'})
      },
    });

  }, [eventType, intl, metricMatcher, metricType, register]);

  const onSubmit = useCallback(data => {
    const param: IEvent = {
      name: data.metricName,
      description: data.description,
      metricType: data.metricType,
      eventType: data.eventType,
      winCriteria: data.winCriteria,
      denominator: 'TOTAL_SAMPLE',
    };

    if (data.eventType === PAGE_VIEW) {
      param.matcher = data.matcher;
      param.url = data.url;
    }

    if (data.eventType === CLICK) {
      param.matcher = data.matcher;
      param.url = data.url;
      param.selector = data.selector;
    }

    if (data.eventType === CUSTOM) {
      param.eventName = data.eventName;
    }

    if (data.metricType === DURATION || data.metricType === REVENUE) {
      param.unit = data.unit;
    }

    setSaveLoading(true);

    createEvent(projectKey, environmentKey, toggleKey, param).then(res => {
      if (res.success) {
        message.success(intl.formatMessage({id: 'analysis.event.save.success'}));
        saveCanSave(false);
        initTargeting();
        getEvent();
        
        if (data.eventType === CUSTOM) {
          getUserGuide();
        }

      } else {
        message.error(intl.formatMessage({id: 'analysis.event.save.error'}));
      }
      setSaveLoading(false);
    });
  }, [projectKey, environmentKey, toggleKey, intl, initTargeting, getEvent, getUserGuide]);

  const handleMetricTypeChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    saveMetricType(data.value as string);

    if (data.value === DURATION || data.value === REVENUE) {
      saveEventType(CUSTOM);
      setValue('eventType', CUSTOM);
    }
  }, [setValue]);

  const handleEventTypeChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    saveEventType(data.value as string);

    // User needs to fill event name again
    setValue('eventName', eventName);
  }, [eventName, setValue]);

  const geMolecularText = useMemo(() => {
    return new Map([
      [CONVERSION, intl.formatMessage({id: 'analysis.event.conversions'})],
      [COUNT, intl.formatMessage({id: 'analysis.event.count'})],
      [REVENUE, intl.formatMessage({id: 'analysis.event.revenue'})],
      [DURATION, intl.formatMessage({id: 'analysis.event.duration'})],
    ]);
  }, [intl]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      saveStepIndex(nextStepIndex);
      saveDictionary(USER_TRACK_EVENT, nextStepIndex);
    }
  }, []);

  return (
    <div className={styles.metrics}>
      <SectionTitle
        showTooltip={false}
        title={intl.formatMessage({id: 'common.metrics.text'})}
      />

      {
        isLoading ? (
          <div className={styles['loading-box']}>
            <Loading /> 
          </div>
        ): (
          <div className={styles['metrics-content']}>
            <Form autoComplete='off'onSubmit={handleSubmit(onSubmit)}>
              <Grid>
                <Grid.Row className={styles.row}>
                  {/* Metric name */}
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.metric.name' />
                      </label>
                      <Form.Input
                        name='metricName'
                        error={ errors.metricName ? true : false }
                        value={metricName}
                        placeholder={
                          intl.formatMessage({id: 'analysis.metric.name.placeholder'})
                        }
                        onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                          setValue(detail.name, detail.value);
                          saveMetricName(detail.value);
                          await trigger('metricName');
                        }}
                      />
                      { errors.metricName && <div className={styles['error-text']}>{ errors.metricName.message }</div> }
                    </Form.Field>
                  </Grid.Column>

                  {/* Metric description */}
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field>
                      <label className={styles.label}>
                        <FormattedMessage id='common.description.text' />
                      </label>
                      <Form.Input
                        name='description'
                        error={ errors.description ? true : false }
                        value={description}
                        placeholder={intl.formatMessage({id: 'common.description.required'})}
                        onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                          setValue(detail.name, detail.value);
                          saveDescription(detail.value);
                        }}
                      />
                    </Form.Field>
                  </Grid.Column>
                  
                  {/* Metric type */}
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.metric.kind' />
                      </label>
                      <Dropdown
                        fluid 
                        selection
                        floating
                        clearable
                        selectOnBlur={false}
                        name='metricType'
                        value={metricType}
                        placeholder={
                          intl.formatMessage({id: 'analysis.metric.kind.placeholder'})
                        } 
                        options={getMetricTypeOptions()} 
                        icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                        error={ errors.metricType ? true : false }
                        onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                          setValue(detail.name, detail.value);
                          handleMetricTypeChange(e, detail);
                          await trigger('metricType');
                        }}
                      />
                    </Form.Field>
                    { errors.metricType && <div className={styles['error-text']}>{ errors.metricType.message }</div> }
                  </Grid.Column>

                  {/* Event type and formula */}
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field>
                      <div className={styles.field}>
                        <div className={styles['field-middle']}>
                          <div className={styles.label}>
                            <span className={styles['label-required']}>*</span>
                            <FormattedMessage id='analysis.event.type' />
                          </div>
                          <Dropdown
                            selection
                            floating
                            name='eventType'
                            value={eventType}
                            error={errors.eventType ? true : false}
                            placeholder={intl.formatMessage({id: 'analysis.event.type.placeholder'})}
                            disabled={!metricType}
                            options={
                              (metricType === CONVERSION || metricType === COUNT) ? getEventTypeOptions() : getSimpleEventTypeOptions()
                            } 
                            icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                            onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                              setValue(detail.name, detail.value);
                              saveEventType(detail.value as string);
                              setPopupOpen(false);
                              handleEventTypeChange(e, detail);
                              await trigger('eventType');
                            }}
                          />
                          { errors.eventType && <div className={styles['error-text-url']}>{ errors.eventType.message }</div> }
                        </div>
                        <div className={styles.formula}>
                          <label className={styles['formula-label']}>
                            <span className={styles['label-required']}>*</span>
                            <FormattedMessage id='analysis.event.formula' />
                          </label>
                          <div>
                            <div className={styles.molecular}>{geMolecularText.get(metricType ?? '') || ''}</div>
                            <div className={styles.divider}></div>
                            <div className={styles.denominator}>
                              <FormattedMessage id='analysis.result.table.samplesize' />
                            </div>
                          </div>
                        </div>
                      </div>
                      {
                        (eventType === PAGE_VIEW || eventType === CLICK) && (
                          <div className={styles['available-sdk']}>
                            <Icon type='warning-circle' customclass={styles['warning-circle']} />
                            <FormattedMessage id='analysis.event.available.sdk' />
                          </div>
                        )
                      }
                    </Form.Field>
                  </Grid.Column>

                  {/* Event name */}
                  {
                    eventType === CUSTOM && (
                      <Grid.Column width={8} className={styles.column}>
                        <Form.Field>
                          <label className={styles.label}>
                            <span className={styles['label-required']}>*</span>
                            <FormattedMessage id='analysis.event.name' />
                          </label>
                          <Form.Input
                            fluid
                            name='eventName'
                            value={eventName}
                            error={ errors.eventName ? true : false }
                            placeholder={
                              intl.formatMessage({id: 'analysis.event.name.placeholder'})
                            }
                            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                              setValue(detail.name, detail.value);
                              saveEventName(detail.value);
                              await trigger('eventName');
                            }}
                          />
                        </Form.Field>
                        <div className={styles['tip-text']}>
                          <FormattedMessage id="analysis.event.name.tip" />
                        </div>
                        { errors.eventName && <div className={styles['error-text']}>{ errors.eventName.message }</div> }
                      </Grid.Column>
                    )
                  }

                  {/* Event matcher and url */}
                  {
                    (eventType === PAGE_VIEW || eventType === CLICK) && (
                      <Grid.Column width={8} className={styles.column}>
                        <Form.Field>
                          <label className={styles.label}>
                            <span className={styles['label-required']}>*</span>
                            <FormattedMessage id='analysis.event.target.url' />
                          </label>
                          <div className={styles.field}>
                            <div className={styles['field-middle']}>
                              <Dropdown
                                selection
                                floating
                                name='matcher'
                                value={metricMatcher}
                                error={ errors.matcher ? true : false }
                                placeholder={
                                  intl.formatMessage({id: 'analysis.event.target.url.matching'})
                                } 
                                options={getUrlMatchOptions()} 
                                icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                                onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                                  setValue(detail.name, detail.value);
                                  saveMetricMatcher(detail.value as string);
                                  setPopupOpen(false);
                                  await trigger('matcher');
                                }}
                              />
                              { errors.matcher && <div className={styles['error-text-url']}>{ errors.matcher.message }</div> }
                            </div>
                            <div className={styles['field-right']}>
                              <Form.Input
                                name='url'
                                error={ errors.url ? true : false }
                                value={metricUrl}
                                placeholder={
                                  intl.formatMessage({id: 'analysis.event.target.url.placeholder'})
                                }
                                onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                                  setValue(detail.name, detail.value);
                                  saveMetricUrl(detail.value);
                                  await trigger('url');
                                }}
                              />
                              { errors.url && <div className={styles['error-text-url']}>{ errors.url.message }</div> }
                              {
                                metricUrl && metricMatcher && (
                                  <CheckURL 
                                    metricUrl={metricUrl}
                                    popupOpen={popupOpen}
                                    metricMatcher={metricMatcher}
                                    setPopupOpen={setPopupOpen}
                                  />
                                )
                              }
                            </div>
                          </div>
                        </Form.Field>
                      </Grid.Column>
                    )
                  }

                  {/* Event target selector */}
                  {
                    eventType === CLICK && (
                      <Grid.Column width={8} className={styles.column}>
                        <Form.Field>
                          <label className={styles.label}>
                            <span className={styles['label-required']}>*</span>
                            <FormattedMessage id='analysis.event.click.target' />
                            <Popup
                              inverted
                              on='click'
                              trigger={<Icon customclass={styles['icon-question']} type='question' />}
                              content={
                                <span>
                                  <FormattedMessage id='analysis.event.click.target.tips' />
                                  <a href={selectorUrl.current} target='_blank'>
                                    <FormattedMessage id='targeting.semver.more' />
                                  </a>
                                </span>
                              }
                              position='top center'
                              className='popup-override'
                              wide={true}
                            />
                          </label>
                          <Form.Input
                            name='selector'
                            value={metricSelector}
                            error={ errors.selector ? true : false }
                            placeholder={intl.formatMessage({id: 'analysis.event.click.target.placeholder'})} 
                            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                              setValue(detail.name, detail.value);
                              saveMetricSelector(detail.value);
                              await trigger('selector');
                            }}
                          />
                        </Form.Field>
                        { errors.selector && <div className={styles['error-text']}>{ errors.selector.message }</div> }
                      </Grid.Column>
                    )
                  }

                  {/* Event unit */}
                  {
                    (metricType === REVENUE || metricType === DURATION) && (
                      <Grid.Column width={8} className={styles.column}>
                        <Form.Field inline={true}>
                          <label className={styles.label}>
                            <span className={styles['label-required']}>*</span>
                            <FormattedMessage id='analysis.metric.unit.text' />
                          </label>
                          <Form.Input
                            fluid
                            name='unit'
                            error={ errors.unit ? true : false }
                            value={unit}
                            placeholder={
                              intl.formatMessage({id: 'analysis.metric.unit.placeholder'})
                            }
                            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                              setValue(detail.name, detail.value);
                              saveUnit(detail.value);
                              await trigger('unit');
                            }}
                          />
                        </Form.Field>
                        { errors.unit && <div className={styles['error-text']}>{ errors.unit.message }</div> }
                      </Grid.Column>
                    )
                  }

                  {/* Event win criteria */}
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.metric.win.criteria.text' />
                      </label>
                      <div className={styles.field}>
                        <Dropdown
                          fluid 
                          selection
                          floating
                          clearable
                          selectOnBlur={false}
                          name='winCriteria'
                          value={winCriteria}
                          placeholder={
                            intl.formatMessage({id: 'analysis.metric.win.criteria.placeholder'})
                          } 
                          options={getWinCriteriaOptions()} 
                          icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                          error={ errors.winCriteria ? true : false }
                          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                            setValue(detail.name, detail.value);
                            saveWinCriteria(detail.value as string);
                            await trigger('winCriteria');
                          }}
                        />
                      </div>
                    </Form.Field>
                    { errors.winCriteria && <div className={styles['error-text-url']}>{ errors.winCriteria.message }</div> }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <div className={styles['metrics-save']}>
                <Button className={styles['btn']} secondary type='submit' disabled={!canSave} loading={saveLoading}>
                  <FormattedMessage id='common.save.text' />
                </Button>
              </div>
            </Form>
          </div>
        )
      }

      <Joyride
        run={run}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress={false}
        showSkipButton
        steps={STEPS}
        scrollOffset={100}
        disableCloseOnEsc={true}
        locale={{
          'back': intl.formatMessage({id: 'guide.last'}),
          'next': intl.formatMessage({id: 'guide.next'}),
          'last': intl.formatMessage({id: 'common.know.text'}),
        }}
        floaterProps={{...floaterStyle}}
        styles={{...tourStyle}}
      />
    </div>
  );
};

export default Metrics;
