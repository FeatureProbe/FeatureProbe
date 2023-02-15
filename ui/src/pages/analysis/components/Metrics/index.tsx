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

import styles from './index.module.scss';

const CUSTOM = 'CUSTOM';
const PAGE_VIEW = 'PAGE_VIEW';
const CLICK = 'CLICK';
const CONVERSION = 'CONVERSION';
const NUMERIC = 'NUMERIC';

interface IProps {
  eventInfo?: IEvent;
  getEvent(): void;
  initTargeting(): void;
}

const Metrics = (props: IProps) => {
  const { eventInfo, initTargeting, getEvent } = props;

  const intl = useIntl();
  const [ metricType, saveMetricType ] = useState<string>('');
  const [ metricName, saveMetricName ] = useState<string>('');
  const [ metricMatcher, saveMetricMatcher ] = useState<string>('');
  const [ metricUrl, saveMetricUrl ] = useState<string>('');
  const [ metricSelector, saveMetricSelector ] = useState<string>('');
  const [ customMetricType, saveCustomMetricType ] = useState<string>('');
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
      setValue('name', eventInfo.name);
      eventInfo?.type === CONVERSION && setValue('conversion', true);
      eventInfo?.type === NUMERIC && setValue('numeric', true);
      saveMetricType(CUSTOM);
      saveCustomMetricType(eventInfo.type);
      eventInfo.name && saveMetricName(eventInfo.name);
    }
  }, [eventInfo, setValue]);

  useEffect(() => {
    const formValues = getValues();

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
    } else if (metricType === CUSTOM) {
      if (eventInfo?.name === formValues.name) {
        saveCanSave(false);
        return;
      }
    }

    saveCanSave(true);
  }, [eventInfo, getValues, metricMatcher, metricName, metricSelector, metricUrl, metricType]);

  useEffect(() => {
    if (intl.locale === 'zh-CN') {
      selectorUrl.current = 'https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors';
    } else if(intl.locale === 'en-US') {
      selectorUrl.current = 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors';
    }
  }, [intl]);

  useEffect(() => {
    register('kind', { 
      required: {
        value: true,
        message: intl.formatMessage({id: 'analysis.event.kind.placeholder'})
      },
    });

    register('name', { 
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
    });

    register('selector', { 
      required: {
        value: metricType === CLICK,
        message: intl.formatMessage({id: 'analysis.event.click.target.placeholder'})
      },
    });

    register('conversion', { 
      required: {
        value: metricType === CUSTOM,
        message: intl.formatMessage({id: 'analysis.event.required'})
      },
    });

  }, [intl, metricType, register]);

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

  const onSubmit = useCallback((data) => {
    const param: IEvent = {
      type: ''
    };

    if (data.kind === CUSTOM) {
      param.name = data.name;
      if (data.conversion) {
        param.type = CONVERSION;
      }
      if (data.numeric) {
        param.type = NUMERIC;
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
  }, [projectKey, environmentKey, toggleKey, intl, initTargeting, getEvent]);

  const handleMetricTypeChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    saveMetricType(data.value as string);
    setValue('name', metricName);
  }, [metricName, setValue]);

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

              {/* event kind */}
              <Grid.Column width={8} className={styles.column}>
                <Form.Field inline={true} className={styles.field}>
                  <label className={styles.label}>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='analysis.event.kind' />
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
                        intl.formatMessage({id: 'analysis.event.kind.placeholder'})
                      } 
                      options={metricOptions} 
                      icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                      error={ errors.kind ? true : false }
                      onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                        setValue(detail.name, detail.value);
                        await trigger('kind');
                        handleMetricTypeChange(e, detail);
                      }}
                    />

                    {/* event kind conversion or numeric */}
                    {
                      metricType === CUSTOM && (
                        <div className={styles['custom-metric-row']}>
                          <div className={styles['custom-metric-radio']}>
                            <Form.Radio
                              name='conversion'
                              checked={customMetricType === 'CONVERSION'}
                              label={intl.formatMessage({id: 'analysis.event.conversion'})}
                              className={styles['custom-metric']}
                              error={ errors.conversion ? true : false }
                              onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                                setValue(detail.name || 'conversion', detail.checked);
                                await trigger('conversion');
                                saveCustomMetricType('CONVERSION');
                              }}
                            />
                            <span className={styles['custom-metric-desc']}>
                              <FormattedMessage id='analysis.event.conversion.desc' />
                            </span>
                            { errors.conversion && <div className={styles['error-text-event']}>{ errors.conversion.message }</div> }
                          </div>
                          
                          <Popup
                            inverted
                            className='popup-override'
                            position='top center'
                            trigger={
                              <div className={`${styles['custom-metric-radio']} ${styles['custom-metric-radio-disabled']}`}>
                                <Form.Radio 
                                  name='numeric'
                                  disabled
                                  label={intl.formatMessage({id: 'analysis.event.numeric'})}
                                  className={styles['custom-metric']}
                                />
                                <span className={styles['custom-metric-desc-disabled']}>
                                  <FormattedMessage id='analysis.event.numeric.desc' />
                                </span>
                              </div>
                            }
                            content={<FormattedMessage id='analysis.event.coming.soon' />}
                          />
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
                        name='name'
                        value={metricName}
                        className={styles['field-right']}
                        error={ errors.name ? true : false }
                        placeholder={
                          intl.formatMessage({id: 'analysis.event.name.placeholder'})
                        }
                        onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                          setValue(detail.name, detail.value);
                          await trigger('name');
                          saveMetricName(detail.value);
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
                            await trigger('matcher');
                            saveMetricMatcher(detail.value as string);
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
                            await trigger('url');
                            saveMetricUrl(detail.value);
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
                          await trigger('selector');
                          saveMetricSelector(detail.value);
                        }}
                      />
                    </Form.Field>
                    { errors.selector && <div className={styles['error-text']}>{ errors.selector.message }</div> }
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
