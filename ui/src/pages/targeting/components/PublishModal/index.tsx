import { useCallback, useState, SyntheticEvent, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { diff } from 'deep-diff';
import {
  Form,
  TextAreaProps,
  Dropdown,
  DropdownItemProps,
  Popup,
  RadioProps,
  InputOnChangeData,
  PaginationProps,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Diff from 'components/Diff';
import { DiffStatusContent } from 'components/Diff/DiffStatus';
import { DiffServe } from 'components/Diff/DiffServe';
import { I18NRules, RulesDiffContent } from 'components/Diff/RulesDiffContent';
import VariationsDiffContent from 'components/Diff/VariationsDiffContent';
import PrerequisitesDiffContent from 'components/Diff/PrerequisitesDiffContent';
import message from 'components/MessageBox';
import { approveToggle, saveToggle, getPrerequisiteDependencies } from 'services/toggle';
import { IRouterParams } from 'interfaces/project';
import { IPrerequisiteToggle, IPrerequisiteToggleList } from 'interfaces/prerequisite';

import {
  IApprovalInfo,
  IOption,
  IRule,
  IServe,
  ITargeting,
  ITargetingParams,
  IVariation,
} from 'interfaces/targeting';

import styles from './index.module.scss';
import ToggleList from './ToggleList';

interface IProps {
  open: boolean;
  approvalInfo?: IApprovalInfo;
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  publishTargeting?: ITargeting;
  initialTargeting?: ITargeting;
  latestVersion: number;
  initTargeting(): void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
}

const PublishModal = (props: IProps) => {
  const {
    open,
    approvalInfo,
    allowEnableTrackEvents,
    trackEvents,
    publishTargeting,
    initialTargeting,
    latestVersion,
    initTargeting,
    setOpen,
    setLoading,
  } = props;

  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const [ comment, saveComment ] = useState<string>('');
  const [ options, saveOptions ] = useState<IOption[]>();
  const [ isCollect, saveIsCollect ] = useState<string>('');
  const [ isDiffChange, saveIsDiffChange ] = useState<boolean>(false);
  const [ isToggleShow, saveToggleShow ] = useState<boolean>(false);
  const [ pagination, setPagination ] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, saveTotal ] = useState<number>(0);
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [ toggles, saveToggles ] = useState<IPrerequisiteToggle[]>([]);
  const intl = useIntl();
  const history = useHistory();
  const {
    formState,
    trigger,
    register,
    setValue,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (open) {
      getPrerequisiteDependencies<IPrerequisiteToggleList>(projectKey, environmentKey, toggleKey, searchParams).then(res => {
        const { success, data } = res;
        if (success && data) {
          const { content, pageable, totalPages, totalElements } = data;
          saveToggles(content);
          setPagination({
            pageIndex: (pageable?.pageNumber || 0) + 1,
            totalPages: totalPages || 1,
          });
          saveTotal(totalElements || 0);
          return;
        } 
      });
    }
  }, [environmentKey, open, projectKey, searchParams, toggleKey]);

  useEffect(() => {
    register('reason', {
      required: approvalInfo?.enableApproval,
    });
    register('isTrackEvent', {
      required: !approvalInfo?.enableApproval && allowEnableTrackEvents,
    });
  }, [register, approvalInfo, allowEnableTrackEvents]);

  useEffect(() => {
    const options = approvalInfo?.reviewers?.map((name: string) => {
      return {
        key: name,
        value: name,
        text: name,
      };
    });
    saveOptions(options);
  }, [approvalInfo]);

  const handlePublishConfirm = useCallback(async () => {
    if (approvalInfo?.enableApproval && comment === '') {
      await trigger('reason');
      return;
    }

    if (!approvalInfo?.enableApproval && allowEnableTrackEvents && isCollect === '') {
      await trigger('isTrackEvent');
      return;
    }

    setOpen(false);
    setLoading(true);

    if (publishTargeting) {
      let res;

      if (approvalInfo && approvalInfo.enableApproval) {
        res = await approveToggle(projectKey, environmentKey, toggleKey, {
          ...publishTargeting,
          comment,
          reviewers: approvalInfo.reviewers,
          baseVersion: latestVersion,
        });
      } else {
        const params: ITargetingParams = {
          ...publishTargeting,
          comment,
          baseVersion: latestVersion,
        };

        if (isCollect === 'yes') {
          params.trackAccessEvents = true;
        }

        res = await saveToggle(projectKey, environmentKey, toggleKey, params);
      }

      if (res.success) {
        if (approvalInfo && approvalInfo?.enableApproval) {
          message.success(intl.formatMessage({ id: 'targeting.approval.request.success' }));
        } else {
          message.success(intl.formatMessage({ id: 'targeting.publish.success.text' }));
        }
        initTargeting();
      } else {
        message.error(res.message || intl.formatMessage({ id: 'targeting.publish.error.text' }));
      }

      saveComment('');
      saveIsCollect('');
      setValue('reason', '');
      setValue('isTrackEvent', '');
      setLoading(false);
    }
  }, [
    intl,
    approvalInfo, 
    comment, 
    isCollect, 
    allowEnableTrackEvents, 
    publishTargeting, 
    projectKey, 
    environmentKey, 
    toggleKey, 
    latestVersion,
    setOpen,
    trigger, 
    setValue, 
    setLoading,
    initTargeting,
  ]);

  const handlePublishCancel = useCallback(() => {
    setOpen(false);
    saveComment('');
    saveIsCollect('');
    setValue('reason', '');
    setValue('isTrackEvent', '');
    clearErrors();
  }, [setOpen, setValue, clearErrors]);

  const handleInputComment = useCallback((e: SyntheticEvent, data: TextAreaProps | InputOnChangeData) => {
    saveComment(data.value as string);
  }, []);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return {
      content: label.text,
      removeIcon: null,
    };
  }, []);

  const handleGotoSetting = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/settings`);
  }, [history, projectKey, environmentKey]);

  const preDiffServe = useCallback((serve?: IServe, variations?: IVariation[]) => {
    if (!serve || !variations) {
      return;
    }
    const obj: {
      select?: string;
      split?: string[];
    } = {};
    if (serve.select !== undefined && typeof serve.select === 'number') {
      obj.select = variations[serve.select]?.name;
    }
    if (serve.split !== undefined) {
      obj.split = serve.split.map((item: number, index: number) => {
        return `${variations[index].name}: ${item / 100}%`;
      });
    }
    return obj;
  }, []);

  const beforeServeDiff = useCallback(
    (before, after) => {
      const left = before;
      const right = after;

      return [
        preDiffServe(left, initialTargeting?.content.variations),
        preDiffServe(right, publishTargeting?.content.variations),
      ];
    },
    [preDiffServe, initialTargeting?.content.variations, publishTargeting?.content.variations]
  );

  const beforeRuleDiff = useCallback(
    (before, after) => {
      const left = I18NRules(before, intl);
      const right = I18NRules(after, intl);
      return [
        left.map((item: IRule) => {
          return {
            ...item,
            serve: preDiffServe(item.serve, initialTargeting?.content.variations),
          };
        }),
        right.map((item: IRule) => {
          return {
            ...item,
            serve: preDiffServe(item.serve, publishTargeting?.content.variations),
          };
        }),
      ];
    },
    [preDiffServe, initialTargeting?.content.variations, publishTargeting?.content.variations, intl]
  );

  const handleRadioChange = useCallback((e: SyntheticEvent, detail: RadioProps) => {
    saveIsCollect(detail.value as string);
  }, []);

  useEffect(() => {
    if (initialTargeting && publishTargeting && open) {
      let isDiffChange = false;
      if (
        diff(initialTargeting.disabled, publishTargeting.disabled) ||
        diff(initialTargeting.content.defaultServe, publishTargeting.content.defaultServe) ||
        diff(initialTargeting.content.disabledServe, publishTargeting.content.disabledServe)
      ) {
        isDiffChange = true;
      }

      const diffVariation = diff(initialTargeting.content.variations, publishTargeting.content.variations);
      if (diffVariation) {
        diffVariation.forEach(item => {
          if (item.kind !== 'E') {
            isDiffChange = true;
          } else if (item.kind === 'E' && (item.path?.[1] !== 'name' && item.path?.[1] !== 'description')) {
            isDiffChange = true;
          }
        });
      }

      const diffRules = diff(initialTargeting.content.rules, publishTargeting.content.rules);
      if (diffRules) {
        diffRules.forEach(item => {
          if (item.kind !== 'E') {
            isDiffChange = true;
          } else if (item.kind === 'E' && item.path?.[1] !== 'name') {
            isDiffChange = true;
          }
        });
      }

      saveIsDiffChange(isDiffChange);
    }
  }, [open, beforeRuleDiff, initialTargeting, publishTargeting]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1,
    });
  }, [searchParams]);

  return (
    <Modal open={open} width={800} handleCancel={handlePublishCancel} handleConfirm={handlePublishConfirm}>
      <div>
        <div className={styles['modal-header']}>
          <span className={styles['modal-header-text']}>
            <FormattedMessage id="targeting.publish.modal.title" />
          </span>
          <Icon customclass={styles['modal-close-icon']} type="close" onClick={handlePublishCancel} />
        </div>
        <div className={styles['modal-content']}>
          {
            isDiffChange && trackEvents && (
              <div className={styles['publish-tips']}>
                <Icon type='error-circle' customclass={styles['error-circle']} />
                <FormattedMessage id='targeting.publish.tips' />
              </div>
            )
          }
          {
            total > 0 && (
              <div className={styles['prerequisite-tips']}>
                <div
                  className={styles['prerequisite-tips-title']}
                  onClick={() => {
                    saveToggleShow(!isToggleShow);
                  }}
                >
                  <div className={styles['prerequisite-tips-left']}>
                    <Icon type='warning-circle' customclass={styles['prerequisite-circle']} />
                    {
                      intl.formatMessage({
                        id: 'targeting.publish.prerequisite.tips'
                      }, {
                        toggle: total,
                      })
                    }
                  </div>
                  {
                    isToggleShow ? (
                      <Icon customclass={styles['icon-accordion']} type="angle-up" />
                    ) : (
                      <Icon customclass={styles['icon-accordion']} type="angle-down" />
                    )
                  }
                </div>
                {
                  isToggleShow && (
                    <div className={styles['prerequisite-toggles']}>
                      <ToggleList 
                        total={total}
                        pagination={pagination}
                        toggleList={toggles}
                        handlePageChange={handlePageChange}
                      />
                    </div>
                  )
                }
              </div>
            )
          }
          <Diff
            sections={[
              {
                before: {
                  disabled: initialTargeting?.disabled,
                },
                after: {
                  disabled: publishTargeting?.disabled,
                },
                title: intl.formatMessage({ id: 'targeting.status.text' }),
                renderContent: (content) => {
                  return <DiffStatusContent content={content} />;
                },
                diffKey: 'status',
              },
              {
                before: initialTargeting?.content.prerequisites ?? [],
                after: publishTargeting?.content.prerequisites ?? [],
                title: intl.formatMessage({ id: 'common.prerequisite.text' }),
                renderContent: (content) => {
                  return <PrerequisitesDiffContent content={content} />;
                },
                diffKey: 'prerequisites',
              },
              {
                before: initialTargeting?.content.variations,
                after: publishTargeting?.content.variations,
                title: intl.formatMessage({ id: 'common.variations.text' }),
                renderContent: (content) => {
                  return <VariationsDiffContent content={content} />;
                },
                diffKey: 'variations',
              },
              {
                before: initialTargeting?.content.rules,
                after: publishTargeting?.content.rules,
                title: intl.formatMessage({ id: 'common.rules.text' }),
                renderContent: (content) => {
                  return <RulesDiffContent content={content} />;
                },
                beforeDiff: beforeRuleDiff,
                diffKey: 'rules',
              },
              {
                before: initialTargeting?.content.defaultServe,
                after: publishTargeting?.content.defaultServe,
                title: intl.formatMessage({ id: 'targeting.default.rule' }),
                renderContent: (content) => {
                  return <DiffServe content={content} />;
                },
                beforeDiff: beforeServeDiff,
                diffKey: 'default',
              },
              {
                title: intl.formatMessage({ id: 'common.disabled.return.type.text' }),
                before: initialTargeting?.content.disabledServe,
                after: publishTargeting?.content.disabledServe,
                renderContent: (content) => {
                  return <DiffServe content={content} />;
                },
                beforeDiff: beforeServeDiff,
                diffKey: 'disabled',
              },
            ]}
            maxHeight={341}
          />
          <div className={styles['diff-after']}>
            <Form>
              {approvalInfo?.enableApproval && (
                <div className={styles.approval}>
                  <div className={styles['approval-title']}>
                    <FormattedMessage id="toggles.settings.approval.reviewers" />:
                    <Popup
                      inverted
                      trigger={<Icon type="info" customclass={styles['icon-info']} />}
                      content={intl.formatMessage({ id: 'targeting.approval.tips' })}
                      position="top center"
                      className="popup-override"
                    />
                  </div>
                  <div className={styles['approval-content']}>
                    <Dropdown
                      fluid
                      multiple
                      value={approvalInfo?.reviewers}
                      options={options}
                      renderLabel={renderLabel}
                      icon={null}
                      disabled={true}
                      className={styles['approval-dropdown']}
                    />
                    <div className={styles['approval-btn']} onClick={handleGotoSetting}>
                      <FormattedMessage id="common.toggle.approval.settings.text" />
                    </div>
                  </div>
                </div>
              )}
              
              {
                !approvalInfo?.enableApproval && allowEnableTrackEvents && (
                  <div className={styles.collect}>
                    <div className={styles['collect-title']}>
                      <span className="label-required">*</span>
                      <FormattedMessage id='targeting.publish.start.collect' />
                    </div>
                    <div className={styles['collect-content']}>
                      <Form.Field className={styles['collect-radio']}>
                        <Form.Radio
                          label={intl.formatMessage({id: 'common.yes.text'})}
                          name='isTrackEvent'
                          value='yes'
                          checked={isCollect === 'yes'}
                          error={formState.errors.isTrackEvent ? true : false}
                          onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                            handleRadioChange(e, detail);
                            setValue(detail.name || 'isTrackEvent', detail.value);
                            await trigger('isTrackEvent');
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.Radio
                          label={intl.formatMessage({id: 'common.no.text'})}
                          name='isTrackEvent'
                          value='no'
                          checked={isCollect === 'no'}
                          error={formState.errors.isTrackEvent ? true : false}
                          onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                            handleRadioChange(e, detail);
                            setValue(detail.name || 'isTrackEvent', detail.value);
                            await trigger('isTrackEvent');
                          }}
                        />
                      </Form.Field>
                    </div>
                    {formState.errors.isTrackEvent && (
                      <div className="error-text">
                        <FormattedMessage id="analysis.select.placeholder" />
                      </div>
                    )}
                  </div>
                )
              }

              <div className={styles.comment}>
                <div className={styles['comment-title']}>
                  {approvalInfo?.enableApproval && <span className="label-required">*</span>}
                  <FormattedMessage id="targeting.publish.modal.comment" />:
                </div>
                <div className={styles['comment-content']}>
                  <Form.TextArea
                    name="reason"
                    error={formState.errors.reason ? true : false}
                    className={styles['comment-input']}
                    placeholder={intl.formatMessage({ id: 'common.input.placeholder' })}
                    onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                      handleInputComment(e, detail);
                      setValue(detail.name, detail.value);
                      await trigger('reason');
                    }}
                  />
                  {formState.errors.reason && (
                    <div className="error-text">
                      <FormattedMessage id="common.input.placeholder" />
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PublishModal;
