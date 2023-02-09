import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Grid, Form, TextAreaProps, Popup, Loader, RadioProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { useForm } from 'react-hook-form';
import Diff from 'components/Diff';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import message from 'components/MessageBox';
import TextLimit from 'components/TextLimit';
import Loading from 'components/Loading';
import VariationsDiffContent from 'components/Diff/VariationsDiffContent';
import { I18NRules, RulesDiffContent } from 'components/Diff/RulesDiffContent';
import { DiffStatusContent } from 'components/Diff/DiffStatus';
import { DiffServe } from 'components/Diff/DiffServe';
import PopupConfirm from 'components/PopupConfirm';
import { variationContainer } from 'pages/targeting/provider';
import { HeaderContainer } from 'layout/hooks';
import { updateApprovalStatus, publishTargetingDraft, cancelTargetingDraft, IApprovalStatus } from 'services/approval';
import { getTargeting, getTargetingDiff } from 'services/toggle';
import { IToggleInfo, IModifyInfo, IApprovalInfo, ITargetingDiff, ITargeting, IContent, ITarget, IServe, IRule } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';
import { OWNER } from 'constants/auth';

import styles from './index.module.scss';

interface IProps {
  toggleInfo?: IToggleInfo;
  modifyInfo?: IModifyInfo;
  approvalInfo?: IApprovalInfo;
  isInfoLoading: boolean;
  targetingDisabled: boolean;
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  activeItem: string;
  gotoGetStarted(): void;
  initTargeting(): void;
  saveApprovalInfo(approvalInfo: IApprovalInfo): void;
  saveInitTargeting(targeting: ITargeting): void;
  refreshTrackvents(): void;
}

const Info: React.FC<IProps> = (props) => {
  const {
    activeItem,
    toggleInfo,
    modifyInfo,
    approvalInfo,
    isInfoLoading,
    targetingDisabled,
    trackEvents,
    allowEnableTrackEvents,
    gotoGetStarted,
    initTargeting,
    saveApprovalInfo,
    saveInitTargeting,
    refreshTrackvents
  } = props;
  const [ enableApproval, saveEnableApproval ] = useState<boolean>(false);
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ diffOpen, saveDiffOpen ] = useState<boolean>(false);
  const [ status, saveStatus ] = useState<string>('');
  const [ isReEdit, saveIsREdit ] = useState<boolean>(true);
  const [ comment, saveComment ] = useState<string>('');
  const [ popupOpen, savePopupOpen ] = useState<boolean>(false);
  const [ toggleStatus, saveToggleStatus ] = useState<string>(approvalInfo?.status || '');
  const [ isCollect, saveIsCollect ] = useState<string>('');
  const [before, saveBefore] = useState<{
    disable: boolean;
    content: ITarget;
  }>();
  const [after, saveAfter] = useState<{
    disable: boolean;
    content: ITarget;
  }>();
  const [ isDiffLoading, saveIsDiffLoading ] = useState<boolean>(false);
  const [ approvePublishLoading, setApprovePublishLoading ] = useState<boolean>(false);
  const { variations } = variationContainer.useContainer();
  const { userInfo } = HeaderContainer.useContainer();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (approvalInfo?.status) {
      saveToggleStatus(approvalInfo.status);
      saveEnableApproval(approvalInfo.enableApproval);
    }
  }, [approvalInfo]);

  useEffect(() => {
    if (!open) {
      clearErrors();
      saveComment('');
    }
  }, [open, clearErrors]);

  useEffect(() => {
    if (targetingDisabled) {
      saveEnableApproval(false);
    }
  }, [targetingDisabled, saveEnableApproval]);

  useEffect(() => {
    register('reason', { 
      required: status !== 'PASS' && status !== 'CANCEL' && status !== 'PUBLISH', 
    });
    register('radioGroup', {
      required: (status === 'JUMP' || status === 'PUBLISH') && allowEnableTrackEvents,
    });
  }, [status, allowEnableTrackEvents, register]);

  // Refresh initial targeting to make new diff
  const refreshInitialTargeting = useCallback(async () => {
    const res = await getTargeting<IContent>(projectKey, environmentKey, toggleKey);
    const { data, success } = res;

    if (success && data) {
      const { content, disabled } = data;
      saveInitTargeting(cloneDeep({
        disabled,
        content,
      }));
    }

    if (approvalInfo) {
        saveApprovalInfo({
        ...approvalInfo,
        locked: false,
        status: 'RELEASE',
      });
    }
  }, [projectKey, environmentKey, toggleKey, approvalInfo, saveApprovalInfo, saveInitTargeting]);

  const onSubmit = useCallback(async () => {
    setValue('reason', '');
    setValue('radioGroup', '');
    saveOpen(false);
    
    if (status === 'CANCEL') {  // Cancel publish
      const res = await cancelTargetingDraft(projectKey, environmentKey, toggleKey, {
        comment
      });
      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.approval.cancel.success'}));
        
        if (isReEdit) {
          refreshInitialTargeting();
        } else {
          initTargeting();
        }
      } else {
        message.error(intl.formatMessage({id: 'targeting.approval.cancel.error'}));
      }
    } else if (status === 'REVOKE') { // Revoke approval
      const res = await updateApprovalStatus(projectKey, environmentKey, toggleKey, {
        status,
        comment,
      });

      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.approval.operate.success'}));
        if (isReEdit) {
          refreshInitialTargeting();
        } else {
          initTargeting();
        }
      } else {
        message.error(intl.formatMessage({id: 'targeting.approval.operate.error'}));
      }
    } else if (status === 'PUBLISH') {  // Publish
      publishTargetingDraft(projectKey, environmentKey, toggleKey, {
        trackAccessEvents: isCollect === 'yes',
      }).then(res => {
        if (res.success) {
          message.success(intl.formatMessage({id: 'targeting.publish.success.text'}));
          initTargeting();
        } else {
          message.error(intl.formatMessage({id: 'targeting.publish.error.text'}));
        }
      });
    } else {  // Other operation
      const params: IApprovalStatus = {
        status,
        comment,
      };

      if (status === 'JUMP' && isCollect === 'yes') {
        params.trackAccessEvents = true;
      }

      const res = await updateApprovalStatus(projectKey, environmentKey, toggleKey, params);

      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.approval.operate.success'}));
        initTargeting();
      } else {
        message.error(intl.formatMessage({id: 'targeting.approval.operate.error'}));
      }
    }
  }, [
    status,
    projectKey,
    environmentKey,
    toggleKey,
    comment, 
    intl,
    isReEdit,
    isCollect,
    setValue,
    initTargeting,
    refreshInitialTargeting
  ]);

  // Abandon this approval
  const handleAbandon = useCallback(async () => {
    const res = await cancelTargetingDraft(projectKey, environmentKey, toggleKey, {
      comment: ''
    });

    if (res.success) {
      initTargeting();
      message.success(intl.formatMessage({id: 'targeting.approval.operate.success'}));
    } else {
      message.error(intl.formatMessage({id: 'targeting.approval.operate.error'}));
    }
  }, [intl, projectKey, environmentKey, toggleKey, initTargeting]);

  // Continue to edit this approval
  const handleReEdit = useCallback(async () => {
    const result = await cancelTargetingDraft(projectKey, environmentKey, toggleKey, {
      comment: ''
    });
    if (result.success) {
      refreshInitialTargeting();
    }
  }, [projectKey, environmentKey, toggleKey, refreshInitialTargeting]);

  // Publish this approval
  const handlePublish = useCallback(() => {
    if (allowEnableTrackEvents) {
      saveOpen(true);
      saveStatus('PUBLISH');
    } else {
      setApprovePublishLoading(true);
      publishTargetingDraft(projectKey, environmentKey, toggleKey).then(res => {
        setApprovePublishLoading(false);
        if (res.success) {
          message.success(intl.formatMessage({id: 'targeting.publish.success.text'}));
          initTargeting();
        } else {
          message.error(intl.formatMessage({id: 'targeting.publish.error.text'}));
        }
      });
    }

    
  }, [allowEnableTrackEvents, projectKey, environmentKey, toggleKey, intl, initTargeting]);

  // Show diffs
  const handleShowDiff = useCallback(async () => {
    saveIsDiffLoading(true);
    const res = await getTargetingDiff<ITargetingDiff>(projectKey, environmentKey, toggleKey);
    saveIsDiffLoading(false);

    const targetingDiff = res.data;
    if (targetingDiff) {
      const { currentContent, oldContent, oldDisabled, currentDisabled } = targetingDiff;
      const before = {
        disable: oldDisabled,
        content: oldContent
      };
      const after = {
        disable: currentDisabled,
        content: currentContent
      };
      saveAfter(after);
      saveBefore(before);

      saveDiffOpen(true);
    }
  }, [projectKey, environmentKey, toggleKey]);

  // Save comment info
  const handleChangeComment = useCallback((e: SyntheticEvent, detail: TextAreaProps) => {
    saveComment(detail.value as string);
  }, []);

  const preDiffServe = useCallback(
    (serve?: IServe) => {
      if (!serve) {
        return;
      }
      const obj: {
        select?: string;
        split?: string[];
      } = {};
      if (serve.select !== undefined && typeof serve.select === 'number') {
        obj.select = variations[serve.select].name;
      }
      if (serve.split !== undefined) {
        obj.split = serve.split.map((item: number, index: number) => {
          return `${variations[index].name}: ${item / 100}%`;
        });
      }

      return obj;
    },
    [variations]
  );

  const beforeServeDiff = useCallback(
    (before, after) => {
      const left: IServe = before;
      const right: IServe = after;

      return [preDiffServe(left), preDiffServe(right)];
    },
    [preDiffServe]
  );

  const beforeRuleDiff = useCallback(
    (before, after) => {
      const left = I18NRules(before, intl);
      const right = I18NRules(after, intl);
      return [
        left.map((item: IRule) => {
          return {
            ...item,
            serve: preDiffServe(item.serve),
          };
        }),
        right.map((item: IRule) => {
          return {
            ...item,
            serve: preDiffServe(item.serve),
          };
        }),
      ];
    },
    [preDiffServe, intl]
  );

  const handleRadioChange = useCallback((e: SyntheticEvent, detail: RadioProps) => {
    saveIsCollect(detail.value as string);
  }, []);

	return (
    <div className={styles.info}>
      {
        isInfoLoading ? <Loading /> : (
          <>
            <div className={styles['info-title']}>
              <div className={styles['info-title-left']}>
                {
                  approvalInfo?.locked && enableApproval && (
                    <Popup
                      inverted
                      className='popup-override'
                      trigger={
                        <span className={styles['toggle-lock-bg']}>
                          <Icon type='lock' customclass={styles['toggle-lock']}></Icon>
                        </span>
                      }
                      content={
                        <div>
                          <div className={styles['popup-line']}><FormattedMessage id='common.lock.text' /></div>
                          <div className={styles['popup-line']}><FormattedMessage id='common.lock.by' />: { approvalInfo?.submitBy }</div>
                          <div className={styles['popup-line']}>
                            <FormattedMessage id='common.lock.time' />: 
                            { dayjs(approvalInfo?.lockedTime).format('YYYY-MM-DD HH:mm:ss') }
                          </div>
                        </div>
                      }
                      position='top center'
                    />
                  )
                }
                <div className={styles['info-toggle-name']}>
                  <TextLimit text={toggleInfo?.name ?? ''} maxWidth={220} />
                </div>
                {
                  enableApproval && toggleStatus === 'PENDING' && (
                    <Popup
                      inverted
                      className='popup-override'
                      position='top center'
                      trigger={
                        <div className={`${styles['status-pending']} ${styles.status}`}>
                          <Icon type='pending' customclass={styles['status-icon']} />
                          <FormattedMessage id='approvals.status.pending' />
                        </div>
                      }
                      content={
                        <span>
                          <FormattedMessage id='toggles.settings.approval.reviewers' />: {approvalInfo?.reviewers?.join(', ')}
                        </span>
                      }
                    />
                  )
                }
                {
                  (
                    enableApproval && 
                    (toggleStatus === 'PASS' || toggleStatus === 'JUMP')
                  ) && (
                    <div className={`${styles['status-publish']} ${styles.status}`}>
                      <Icon type='wait' customclass={styles['status-icon']} />
                      <FormattedMessage id='approvals.status.unpublished' />
                    </div>
                  )
                }
                {
                  enableApproval && toggleStatus === 'REJECT' && (
                    <Popup
                      inverted
                      className='popup-override'
                      trigger={
                        <div className={`${styles['status-reject']} ${styles.status}`}>
                          <Icon type='reject' customclass={styles['status-icon']} />
                          <FormattedMessage id='approvals.status.declined' />
                        </div>
                      }
                      content={
                        <span>
                          <FormattedMessage id='approvals.reviewed.by' /> {approvalInfo?.approvalBy}: {approvalInfo?.approvalComment}
                        </span>
                      }
                      position='top center'
                    />
                  )
                }
              </div>
              <div className={styles['info-title-right']}>
                {
                  !toggleInfo?.archived && (
                    <div className={styles['connect-sdk']} onClick={gotoGetStarted}>
                      <Icon type='connect-sdk' customclass={styles['icon-connect-sdk']} />
                      <FormattedMessage id='toggle.connect' />
                    </div>
                  )
                }
                <div>
                  {/* Button Show Changes */}
                  {
                    enableApproval && toggleStatus !== 'RELEASE' && (
                      <Button secondary className={styles.btn} onClick={handleShowDiff} disabled={isDiffLoading}>
                        { isDiffLoading && <Loader active inline size='tiny' className={styles['loader']} /> }
                        <span className={styles['loader-text']}>
                          <FormattedMessage id='targeting.approval.operation.view.changes' />
                        </span>
                      </Button>
                    )
                  }

                  {
                    enableApproval && toggleStatus === 'PENDING' && (
                      <>
                        {/* Button Skip Approval */}
                        {
                          approvalInfo?.submitBy === userInfo.account && (
                            <Button 
                              secondary 
                              className={styles['dangerous-btn']} 
                              onClick={() => { 
                                saveOpen(true);
                                saveStatus('JUMP');
                              }}
                            >
                              <FormattedMessage id='targeting.approval.operation.skip.approval' />
                            </Button>
                          )
                        }

                        {/* Button Withdraw */}
                        {
                          (approvalInfo?.submitBy === userInfo.account || OWNER.includes(userInfo.role)) && (
                            <Button 
                              secondary 
                              className={styles['dangerous-btn']}
                              onClick={() => { 
                                saveOpen(true);
                                saveStatus('REVOKE');
                              }}
                            >
                              <FormattedMessage id='targeting.approval.operation.withdraw' />
                            </Button>
                          )
                        }

                        {/* Button Decline */}
                        {/* Button Accept */}
                        {
                          approvalInfo?.reviewers?.includes(userInfo.account) && (
                            <>
                              <Button 
                                secondary 
                                className={styles['dangerous-btn']}
                                onClick={() => { 
                                  saveOpen(true);
                                  saveStatus('REJECT');
                                }}
                              >
                                <FormattedMessage id='targeting.approval.operation.decline' />
                              </Button>
                              <Button 
                                primary 
                                className={styles.btn}
                                onClick={() => { 
                                  saveOpen(true);
                                  saveStatus('PASS');
                                }}
                              >
                                <FormattedMessage id='targeting.approval.operation.accept' />
                              </Button>
                            </>
                          )
                        }
                      </>
                    )
                  }

                  {/* Button Abandon */}
                  {
                    (
                      enableApproval && 
                      (toggleStatus === 'PASS' || toggleStatus === 'JUMP') && 
                      (approvalInfo?.submitBy === userInfo.account || OWNER.includes(userInfo.role))
                    ) && (
                      <Button 
                        secondary 
                        className={styles['dangerous-btn']}
                        onClick={() => { 
                          saveOpen(true);
                          saveStatus('CANCEL');
                        }}
                      >
                        <FormattedMessage id='targeting.approval.operation.abandon' />
                      </Button>
                    )
                  }

                  {/* Button Publish */}
                  {
                    (
                      enableApproval && 
                      (toggleStatus === 'PASS' || toggleStatus === 'JUMP') && 
                      (approvalInfo?.submitBy === userInfo.account)
                    ) && (
                      <Button 
                        primary 
                        loading={approvePublishLoading} 
                        disabled={approvePublishLoading} 
                        className={styles.btn} 
                        onClick={handlePublish}
                      >
                        <FormattedMessage id='targeting.approval.operation.publish' />
                      </Button>
                    )
                  }
                  
                  {/* Button Abandon */}
                  {/* Button Modify */}
                  {
                    (
                      enableApproval && 
                      toggleStatus === 'REJECT' && 
                      (approvalInfo?.submitBy === userInfo.account || OWNER.includes(userInfo.role))
                    ) && (
                      <>
                        <Button secondary className={styles['dangerous-btn']} onClick={() => { handleAbandon(); }}>
                          <FormattedMessage id='targeting.approval.operation.abandon' />
                        </Button>
                        <Button primary className={styles.btn} onClick={() => { handleReEdit(); }}>
                          <FormattedMessage id='targeting.approval.operation.modify' />
                        </Button>
                      </>
                    )
                  }

                  {/* Button Edit */}
                  {
                    activeItem === 'targeting' &&
                    trackEvents && 
                    ((enableApproval && toggleStatus === 'RELEASE') || !enableApproval) && 
                    (
                      <PopupConfirm
                        open={popupOpen}
                        handleConfirm={(e: SyntheticEvent) => {
                          e.stopPropagation();
                          refreshTrackvents();
                          savePopupOpen(false);
                        }}
                        handleCancel={(e: SyntheticEvent) => {
                          e.stopPropagation();
                          savePopupOpen(false);
                        }}
                        text={intl.formatMessage({id: 'targeting.edit.tips'})}
                        icon={<Icon type='warning-circle' customclass={styles['warinig-circle']} />}
                      >
                        <Button 
                          primary
                          className={styles.btn}
                          onClick={(e: SyntheticEvent) => {
                            savePopupOpen(true);
                            e.stopPropagation();
                          }}
                        >
                          <FormattedMessage id='common.edit.text' />
                        </Button>
                      </PopupConfirm>
                    )
                  }
                </div>
              </div>
            </div>
            <div className={styles['info-content']}>
              <Grid columns='equal'>
                <Grid.Row className={styles['info-content-row']}>
                  <Grid.Column>
                    <div className={styles.label}>
                      <FormattedMessage id='common.key.text' />:
                    </div>
                    <div className={`${styles['label-value-copy']} ${styles['label-value']}`}>
                      <CopyToClipboardPopup text={toggleInfo?.key || ''}>
                        <span>{toggleInfo?.key ? toggleInfo.key : '-'}</span>
                      </CopyToClipboardPopup>
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <div className={styles.label}>
                    <FormattedMessage id='common.type.text' />:
                    </div>
                    <div className={styles['label-value']}>{toggleInfo?.returnType ? toggleInfo.returnType : '-'}</div>
                  </Grid.Column>
                  <Grid.Column>
                    <div className={styles.label}>
                      <FormattedMessage id='common.description.text' />:
                    </div>
                    <div className={styles['label-value']}>{toggleInfo?.desc ? toggleInfo.desc : '-'}</div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles['info-content-row']}>
                  <Grid.Column>
                    <div className={styles.label}>
                      <FormattedMessage id='common.updated.by.text' />:
                    </div>
                    <div className={styles['label-value']}>{modifyInfo?.modifiedBy ? modifyInfo.modifiedBy : '-'}</div>
                  </Grid.Column>
                  <Grid.Column>
                    <div className={styles.label}>
                      <FormattedMessage id='common.updated.time.text' />:
                    </div>
                    {
                      approvalInfo?.publishTime ? (
                        <div className={styles['label-value']}>
                          {dayjs(approvalInfo.publishTime).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      ) : <>-</>
                    }
                  </Grid.Column>
                  <Grid.Column>
                    <div className={styles.label}>
                      <FormattedMessage id='common.tags.text' />:
                    </div>
                    <div>
                      { toggleInfo?.tags.join(',') || '-'}
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </>
        )
      }
      <Modal open={open} width={480} footer={null}>
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              { status === 'PASS' && <FormattedMessage id='targeting.approval.modal.accept' /> }
              { status === 'REVOKE' && <FormattedMessage id='targeting.approval.modal.withdraw' /> }
              { status === 'REJECT' && <FormattedMessage id='targeting.approval.modal.reject' /> }
              { status === 'JUMP' && <FormattedMessage id='targeting.approval.operation.skip.approval' /> }
              { status === 'CANCEL' && <FormattedMessage id='targeting.approval.operation.abandon' /> }
              { status === 'PUBLISH' && <FormattedMessage id='targeting.approval.operation.publish' />}
            </span>
            <Icon customclass={styles['modal-header-icon']} type='close' onClick={() => { 
              setValue('reason', '');
              setValue('radioGroup', '');
              saveOpen(false); }} 
            />
          </div>
          <div className={styles['modal-content']}>
            <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {
                (status === 'REVOKE' || status === 'CANCEL') && (
                  <div className={styles['modal-continue-edit']}>
                    <FormattedMessage id='targeting.approval.modal.modify.text' />
                    <div className={styles['radio-group']}>
                      <Form.Radio
                        name='yes'
                        label={intl.formatMessage({id: 'common.yes.text'})}
                        className={styles['radio-group-item']}
                        checked={isReEdit}
                        onChange={() => { saveIsREdit(!isReEdit); }}
                      />
                      <Form.Radio 
                        name='no'
                        label={intl.formatMessage({id: 'common.no.text'})}
                        className={styles['radio-group-item']}
                        checked={!isReEdit}
                        onChange={() => { saveIsREdit(!isReEdit); }}
                      />
                    </div>
                  </div>
                )
              }
              {
                (status === 'JUMP' || status === 'PUBLISH') && allowEnableTrackEvents && (
                  <div className={styles.collect}>
                    <div className={styles['collect-title']}>
                      <span className="label-required">*</span>
                      <FormattedMessage id='targeting.publish.start.collect' />
                    </div>
                    <div className={styles['collect-content']}>
                      <Form.Field className={styles['collect-radio']}>
                        <Form.Radio
                          label={intl.formatMessage({id: 'common.yes.text'})}
                          name='radioGroup'
                          value='yes'
                          checked={isCollect === 'yes'}
                          error={errors.radioGroup ? true : false}
                          onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                            handleRadioChange(e, detail);
                            setValue(detail.name || 'radioGroup', detail.value);
                            await trigger('radioGroup');
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Form.Radio
                          label={intl.formatMessage({id: 'common.no.text'})}
                          name='radioGroup'
                          value='no'
                          checked={isCollect === 'no'}
                          error={errors.radioGroup ? true : false}
                          onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                            handleRadioChange(e, detail);
                            setValue(detail.name || 'radioGroup', detail.value);
                            await trigger('radioGroup');
                          }}
                        />
                      </Form.Field>
                    </div>
                    {errors.radioGroup && (
                      <div className="error-text">
                        <FormattedMessage id="common.dropdown.placeholder" />
                      </div>
                    )}
                  </div>
                )
              }
              {
                status !== 'PUBLISH' && (
                  <>
                    <Form.Field>
                      <label>
                        { (status !== 'PASS' && status !== 'CANCEL') && <span className={styles['label-required']}>*</span> }
                        <FormattedMessage id='targeting.approval.modal.reason' />:
                      </label>
                      
                      <Form.TextArea
                        name='reason'
                        error={errors.reason ? true : false}
                        value={comment} 
                        placeholder={intl.formatMessage({id: 'targeting.approval.modal.reason.placeholder'})}
                        className={styles.input}
                        onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                          handleChangeComment(e, detail);
                          setValue(detail.name, detail.value);
                          await trigger('reason');
                        }}
                      />
                    </Form.Field>
                    { 
                      errors.reason && (
                        <div className={styles['error-text']}>
                          <FormattedMessage id='targeting.approval.modal.reason.placeholder' />
                        </div> 
                      )
                    }
                  </>
                )
              }
              <div className={styles['footer']} onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
                <Button size='mini' basic type='reset' onClick={() => { 
                  setValue('reason', '');
                  setValue('radioGroup', '');
                  saveOpen(false); 
                }}>
                  <FormattedMessage id='common.cancel.text' />
                </Button>
                <Button size='mini' className={styles['footer-btn']} type='submit' primary>
                  <FormattedMessage id='common.confirm.text' />
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal 
        open={diffOpen}
        width={800}
        handleCancel={() => { saveDiffOpen(false); }}
        handleConfirm={() => { saveDiffOpen(false); }}
        footer={null}
      >
        <div>
          <div className={styles['diff-modal-header']}>
            <span className={styles['diff-modal-header-text']}>
              <FormattedMessage id='common.changes.text' />
            </span>
            <Icon customclass={styles['diff-modal-close-icon']} type='close' onClick={() => { saveDiffOpen(false); }} />
          </div>
          <div className={styles['diff-modal-content']}>
            <Diff
              defaultOpen={true}
              maxHeight={341}
              sections={[
                {
                  before: {
                    disabled: before?.disable,
                  },
                  after: {
                    disabled: after?.disable,
                  },
                  title: intl.formatMessage({ id: 'targeting.status.text' }),
                  renderContent: (content) => {
                    return <DiffStatusContent content={content} />;
                  },
                  diffKey: 'status',
                },
                {
                  before: before?.content.variations,
                  after: after?.content.variations,
                  title: intl.formatMessage({ id: 'common.variations.text' }),
                  renderContent: (content) => {
                    return <VariationsDiffContent content={content} />;
                  },
                  diffKey: 'variations',
                },
                {
                  before: before?.content.rules,
                  after: after?.content.rules,
                  title: intl.formatMessage({ id: 'common.rules.text' }),
                  renderContent: (content) => {
                    return <RulesDiffContent content={content} />;
                  },
                  beforeDiff: beforeRuleDiff,
                  diffKey: 'rules',
                },
                {
                  before: before?.content.defaultServe,
                  after: after?.content.defaultServe,
                  title: intl.formatMessage({ id: 'targeting.default.rule' }),
                  renderContent: (content) => {
                    return <DiffServe content={content} />;
                  },
                  beforeDiff: beforeServeDiff,
                  diffKey: 'default',
                },
                {
                  title: intl.formatMessage({ id: 'common.disabled.return.type.text' }),
                  before: before?.content.disabledServe,
                  after: after?.content.disabledServe,
                  renderContent: (content) => {
                    return <DiffServe content={content} />;
                  },
                  beforeDiff: beforeServeDiff,
                  diffKey: 'disabled',
                },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default Info;