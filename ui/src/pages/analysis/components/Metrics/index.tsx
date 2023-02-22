import { useCallback, useMemo, useState, SyntheticEvent, useEffect, useRef } from 'react';
import { Dropdown, DropdownProps, Form, Grid, InputOnChangeData, Popup, RadioProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import SectionTitle from 'components/SectionTitle';
import Button from 'components/Button';
import message from 'components/MessageBox';
import { IEvent } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { createEvent } from 'services/analysis';
import { CUSTOM, CONVERSION, CLICK, PAGE_VIEW, NUMERIC } from '../../constants';

import styles from './index.module.scss';

interface IProps {
  eventInfo?: IEvent;
  getEvent(): void;
  initTargeting(): void;
}

const Metrics = (props: IProps) => {
  const { eventInfo, initTargeting, getEvent } = props;

  const intl = useIntl();
  const [ metricName, saveMetricName ] = useState<string>('');
  const [ description, saveDescription ] = useState<string>('');
  const [ metricType, saveMetricType ] = useState<string>('');
  const [ eventName, saveEventName ] = useState<string>('');
  const [ metricMatcher, saveMetricMatcher ] = useState<string>('');
  const [ metricUrl, saveMetricUrl ] = useState<string>('');
  const [ metricSelector, saveMetricSelector ] = useState<string>('');
  const [ customMetricType, saveCustomMetricType ] = useState<string>('');
  const [ unit, saveUnit ] = useState<string>('');
  const [ winCriteria, saveWinCriteria ] = useState<string>('');
  const [ canSave, saveCanSave ] = useState<boolean>(false);
  const [ saveLoading, setSaveLoading ] = useState<boolean>(false);
  const selectorUrl = useRef('');
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
  } = useForm();

  useEffect(() => {
    if(eventInfo) {
      setValue('metricName', eventInfo.name);
      setValue('description', eventInfo.description);
      saveMetricName(eventInfo.name);
      eventInfo.description && saveDescription(eventInfo.description);
    }

    if (eventInfo?.type === PAGE_VIEW || eventInfo?.type === CLICK) {
      setValue('matcher', eventInfo.matcher);
      setValue('url', eventInfo.url);
      setValue('kind', eventInfo.type);
      saveMetricType(eventInfo.type);
      eventInfo.url && saveMetricUrl(eventInfo.url);
      eventInfo.matcher && saveMetricMatcher(eventInfo.matcher);
    }

    if (eventInfo?.type === CLICK) {
      setValue('selector', eventInfo.selector);
      eventInfo.selector && saveMetricSelector(eventInfo.selector);
    }

    if (eventInfo?.type === CONVERSION || eventInfo?.type === NUMERIC) {
      setValue('kind', CUSTOM);
      setValue('eventName', eventInfo.eventName);
      eventInfo?.type === CONVERSION && setValue('customMetricType', 'conversion');
      eventInfo?.type === NUMERIC && setValue('customMetricType', 'numeric');
      saveMetricType(CUSTOM);
      saveCustomMetricType(eventInfo.type);
      eventInfo.eventName && saveEventName(eventInfo.eventName);
    }

    if(eventInfo?.type === NUMERIC) {
      setValue('winCriteria', eventInfo.winCriteria);
      setValue('unit', eventInfo.unit);
      eventInfo.winCriteria && saveWinCriteria(eventInfo.winCriteria);
      eventInfo.unit && saveUnit(eventInfo.unit);
    }
  }, [eventInfo, setValue]);

  useEffect(() => {
    const formValues = getValues();
    if(
      eventInfo?.name !== formValues.metricName ||
      eventInfo?.description !== formValues.description
    ) {
      saveCanSave(true);
      return;
    }

    if (metricType === PAGE_VIEW) {
      if (
        eventInfo?.type === formValues.kind  &&
        eventInfo?.matcher === formValues.matcher &&
        eventInfo?.url === formValues.url
      ) {
        saveCanSave(false);
        return;
      }
    } else if (metricType === CLICK) {
      if (
        eventInfo?.type === formValues.kind && 
        eventInfo?.matcher === formValues.matcher &&
        eventInfo?.url === formValues.url &&
        eventInfo?.selector === formValues.selector
      ) {
        saveCanSave(false);
        return;
      }
    } else if (metricType === CUSTOM && customMetricType === CONVERSION) {
      if (
        eventInfo?.eventName === formValues.eventName &&
        eventInfo?.type === customMetricType
      ) {
        saveCanSave(false);
        return;
      }
    } else if(metricType === CUSTOM && customMetricType === NUMERIC) {
      if (
        eventInfo?.eventName === formValues.eventName &&
        eventInfo?.unit === formValues.unit &&
        eventInfo?.winCriteria === formValues.winCriteria &&
        eventInfo?.type === customMetricType
      ) {
        saveCanSave(false);
        return;
      }
    }

    saveCanSave(true);
  }, [eventInfo, getValues, metricMatcher, eventName, metricSelector, metricUrl, metricType, unit, winCriteria, metricName, description, customMetricType]);

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

    register('kind', { 
      required: {
        value: true,
        message: intl.formatMessage({id: 'analysis.metric.kind.placeholder'})
      },
    });

    register('eventName', { 
      required: {
        value: metricType === CUSTOM,
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
        value: metricType === PAGE_VIEW || metricType === CLICK,
        message: intl.formatMessage({id: 'analysis.event.target.url.matching'})
      },
    });

    register('url', { 
      required: {
        value: metricType === PAGE_VIEW || metricType === CLICK,
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
        value: metricType === CLICK,
        message: intl.formatMessage({id: 'analysis.event.click.target.placeholder'})
      },
    });

    register('customMetricType', { 
      required: {
        value: metricType === CUSTOM,
        message: intl.formatMessage({id: 'analysis.event.required'})
      },
    });

    register('unit', { 
      required: {
        value: metricType === CUSTOM && customMetricType === NUMERIC,
        message: intl.formatMessage({id: 'analysis.metric.unit.placeholder'})
      },
    });

    register('winCriteria', { 
      required: {
        value: metricType === CUSTOM && customMetricType === NUMERIC,
        message: intl.formatMessage({id: 'analysis.metric.win.criteria.placeholder'})
      },
    });

  }, [intl, metricMatcher, metricType, register, customMetricType]);

  const metricOptions = useMemo(() => {
    return [
      { 
        key: CUSTOM, 
        value: CUSTOM, 
        text: intl.formatMessage({id: 'analysis.event.custom'}) 
      },
      { 
        key: PAGE_VIEW, 
        value: PAGE_VIEW, 
        text: intl.formatMessage({id: 'analysis.event.pageview'}) 
      },
      { 
        key: CLICK, 
        value: CLICK, 
        text: intl.formatMessage({id: 'analysis.event.click'}) 
      },
    ];
  }, [intl]);

  const urlMatchOption = useMemo(() => {
    return [
      { 
        key: 'simple', 
        value: 'SIMPLE', 
        text: intl.formatMessage({id: 'analysis.event.target.url.matching.simple'}) 
      },
      { 
        key: 'exact', 
        value: 'EXACT', 
        text: intl.formatMessage({id: 'analysis.event.target.url.matching.exact'}) 
      },
      { 
        key: 'substring', 
        value: 'SUBSTRING', 
        text: intl.formatMessage({id: 'analysis.event.target.url.matching.substring'}) 
      },
      { 
        key: 'regex', 
        value: 'REGULAR', 
        text: intl.formatMessage({id: 'analysis.event.target.url.matching.regex'}) 
      },
    ];
  }, [intl]);

  const winCriteriaOption = useMemo(() => {
    return [
      { 
        key: 'lower', 
        value: 'NEGATIVE', 
        text: intl.formatMessage({id: 'analysis.metric.target.win.criteria.lower'}) 
      },
      { 
        key: 'greater', 
        value: 'POSITIVE', 
        text: intl.formatMessage({id: 'analysis.metric.target.win.criteria.greater'}) 
      },
    ];
  }, [intl]);

  const onSubmit = useCallback((data) => {
    const param: IEvent = {
      name: data.metricName,
      description: data.description,
      type: ''
    };

    if (data.kind === CUSTOM) {
      param.eventName = data.eventName;
      if (customMetricType === CONVERSION) {
        param.type = CONVERSION;
      }
      if (customMetricType === NUMERIC) {
        param.type = NUMERIC;
        param.unit = data.unit;
        param.winCriteria = data.winCriteria;
      }
    }

    if (data.kind === PAGE_VIEW) {
      param.type = PAGE_VIEW;
      param.matcher = data.matcher;
      param.url = data.url;
    }

    if (data.kind === CLICK) {
      param.type = CLICK;
      param.matcher = data.matcher;
      param.url = data.url;
      param.selector = data.selector;
    }

    setSaveLoading(true);

    createEvent(projectKey, environmentKey, toggleKey, param).then(res => {
      if (res.success) {
        message.success(intl.formatMessage({id: 'analysis.event.save.success'}));
        saveCanSave(false);
        initTargeting();
        getEvent();
      } else {
        message.error(intl.formatMessage({id: 'analysis.event.save.error'}));
      }
      setSaveLoading(false);
    });
  }, [projectKey, environmentKey, toggleKey, intl, initTargeting, getEvent, customMetricType]);

  const handleMetricTypeChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    saveMetricType(data.value as string);
    setValue('name', eventName);
  }, [eventName, setValue]);

  return (
    <div className={styles.metrics}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.metrics.text'})}
        showTooltip={false}
      />

      <div className={styles['metrics-content']}>
        <Form autoComplete='off'onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <Grid.Row className={styles.row}>
              {/* Name and description */}
              <Grid.Column width={8} className={styles.column}>
                <Form.Field inline={true} className={styles.field}>
                  <label className={styles.label}>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='analysis.metric.name' />
                  </label>
                  <div className={styles['field-right']}>
                    <Form.Input
                      fluid
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
                  </div>
                </Form.Field>
                { errors.metricName && <div className={styles['error-text']}>{ errors.metricName.message }</div> }
              </Grid.Column>
              <Grid.Column width={8} className={styles.column}>
                <Form.Field inline={true} className={styles.field}>
                  <label className={styles.label}>
                    <FormattedMessage id='common.description.text' />
                  </label>
                  <div className={styles['field-right']}>
                    <Form.Input
                      fluid
                      name='description'
                      error={ errors.description ? true : false }
                      value={description}
                      placeholder={
                        intl.formatMessage({id: 'common.description.required'})
                      }
                      onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                        setValue(detail.name, detail.value);
                        saveDescription(detail.value);
                      }}
                    />
                  </div>
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className={styles.row}>

              {/* event kind */}
              <Grid.Column width={8} className={styles.column}>
                <Form.Field inline={true} className={styles.field}>
                  <label className={styles.label}>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='analysis.metric.kind' />
                  </label>
                  <div className={styles['field-right']}>
                    <Dropdown
                      fluid 
                      selection
                      floating
                      clearable
                      selectOnBlur={false}
                      name='kind'
                      value={metricType}
                      placeholder={
                        intl.formatMessage({id: 'analysis.metric.kind.placeholder'})
                      } 
                      options={metricOptions} 
                      icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                      error={ errors.kind ? true : false }
                      onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                        setValue(detail.name, detail.value);
                        handleMetricTypeChange(e, detail);
                        await trigger('kind');
                      }}
                    />

                    {/* event kind conversion or numeric */}
                    {
                      metricType === CUSTOM && (
                        <div className={styles['custom-metric-row']}>
                          <div className={styles['custom-metric-radio']}>
                            <Form.Radio
                              name='customMetricType'
                              value='conversion'
                              checked={customMetricType === 'CONVERSION'}
                              label={intl.formatMessage({id: 'analysis.event.conversion'})}
                              className={styles['custom-metric']}
                              error={ errors.customMetricType ? true : false }
                              onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                                if(detail.checked) {
                                  setValue(detail.name || 'customMetricType','conversion');
                                  saveCustomMetricType('CONVERSION');
                                }
                                await trigger('customMetricType');
                              }}
                            />
                            <span className={styles['custom-metric-desc']}>
                              <FormattedMessage id='analysis.event.conversion.desc' />
                            </span>
                            { errors.customMetricType && <div className={styles['error-text-event']}>{ errors.customMetricType.message }</div> }
                          </div>
                          
                          <div className={`${styles['custom-metric-radio']} ${styles['custom-metric-radio']}`}>
                            <Form.Radio 
                              name='customMetricType'
                              value='numeric'
                              label={intl.formatMessage({id: 'analysis.event.numeric'})}
                              className={styles['custom-metric']}
                              checked={customMetricType === 'NUMERIC'}
                              error={ errors.customMetricType ? true : false }
                              onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                                if(detail.checked) {
                                  setValue(detail.name || 'customMetricType', 'numeric');
                                  saveCustomMetricType('NUMERIC');
                                }
                                await trigger('customMetricType');
                              }}
                            />
                            <span className={styles['custom-metric-desc']}>
                              <FormattedMessage id='analysis.event.numeric.desc' />
                            </span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                  
                </Form.Field>
                { errors.kind && <div className={styles['error-text']}>{ errors.kind.message }</div> }
              </Grid.Column>

              {/* event name */}
              {
                metricType === CUSTOM && (
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field className={styles.field}>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.event.name' />
                      </label>
                      <Form.Input
                        fluid
                        name='eventName'
                        value={eventName}
                        className={styles['field-right']}
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
                    { errors.name && <div className={styles['error-text']}>{ errors.name.message }</div> }
                  </Grid.Column>
                )
              }

              {/* event matcher and url */}
              {
                (metricType === PAGE_VIEW || metricType === CLICK) && (
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field className={styles.field}>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.event.target.url' />
                      </label>
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
                          options={urlMatchOption} 
                          icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                            setValue(detail.name, detail.value);
                            saveMetricMatcher(detail.value as string);
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
                      </div>
                    </Form.Field>
                  </Grid.Column>
                )
              }
            </Grid.Row>

            {/* event target selector */}
            {
              metricType === CLICK && (
                <Grid.Row className={styles.row}>
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field className={styles.field}>
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
                        className={styles['field-right']}
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
                </Grid.Row>
              )
            }

            {/* event unit and win criteria */}
            {
              metricType === CUSTOM && customMetricType ===  NUMERIC && (
                <Grid.Row className={styles.row}>
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field inline={true} className={styles.field}>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.metric.unit.text' />
                      </label>
                      <div className={styles['field-right']}>
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
                      </div>
                    </Form.Field>
                    { errors.unit && <div className={styles['error-text']}>{ errors.unit.message }</div> }
                  </Grid.Column>
                  <Grid.Column width={8} className={styles.column}>
                    <Form.Field className={styles.field}>
                      <label className={styles.label}>
                        <span className={styles['label-required']}>*</span>
                        <FormattedMessage id='analysis.metric.win.criteria.text' />
                      </label>
                      <div className={styles['field-right']}>
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
                          options={winCriteriaOption} 
                          icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                          error={ errors.winCriteria ? true : false }
                          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                            setValue(detail.name, detail.value);
                            saveWinCriteria(detail.value as string);
                            await trigger('winCriteria');
                          }}
                        />
                        { errors.winCriteria && <div className={styles['error-text-url']}>{ errors.winCriteria.message }</div> }
                      </div>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              )
            }
          </Grid>
          <div className={styles['metrics-save']}>
            <Button className={styles['btn']} secondary type='submit' disabled={!canSave} loading={saveLoading}>
              <FormattedMessage id='common.save.text' />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Metrics;
