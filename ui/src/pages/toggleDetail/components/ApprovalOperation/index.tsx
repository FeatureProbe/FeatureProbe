import message from 'components/MessageBox';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, TextAreaProps, RadioProps } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import { HeaderContainer } from 'layout/hooks';
import { updateApprovalStatus, publishTargetingDraft, cancelTargetingDraft, IApprovalStatus } from 'services/approval';
import { getTargeting } from 'services/toggle';
import { OWNER } from 'constants/auth';
import { IApprovalInfo, ITargeting, IContent } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';

import styles from './index.module.scss';

interface IProps {
  approvalInfo?: IApprovalInfo;
  allowEnableTrackEvents: boolean;
  enableApproval: boolean;
  toggleStatus: string;
  initTargeting(): void;
  saveInitTargeting(targeting: ITargeting): void;
  saveApprovalInfo(approvalInfo: IApprovalInfo): void;
}

const ApprovalOperation = (props: IProps) => {
  const { 
    approvalInfo,
    allowEnableTrackEvents,
    enableApproval,
    toggleStatus,
    initTargeting,
    saveApprovalInfo,
    saveInitTargeting,
  } = props;

  const [ approvePublishLoading, setApprovePublishLoading ] = useState<boolean>(false);
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ status, saveStatus ] = useState<string>('');
  const [ isReEdit, saveIsREdit ] = useState<boolean>(true);
  const [ isCollect, saveIsCollect ] = useState<string>('');
  const [ comment, saveComment ] = useState<string>('');
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
    register('reason', { 
      required: status !== 'PASS' && status !== 'CANCEL' && status !== 'PUBLISH', 
    });
    register('isTrackEvent', {
      required: (status === 'JUMP' || status === 'PUBLISH') && allowEnableTrackEvents,
    });
  }, [status, allowEnableTrackEvents, register]);

  useEffect(() => {
    if (!open) {
      clearErrors();
      saveComment('');
      saveIsCollect('');
    }
  }, [open, clearErrors]);

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

  // Continue to edit this approval
  const handleReEdit = useCallback(async () => {
    const result = await cancelTargetingDraft(projectKey, environmentKey, toggleKey, {
      comment: ''
    });
    if (result.success) {
      refreshInitialTargeting();
    }
  }, [projectKey, environmentKey, toggleKey, refreshInitialTargeting]);

  const onSubmit = useCallback(async () => {
    setValue('reason', '');
    setValue('isTrackEvent', '');
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

  const handleCollectChange = useCallback((e: SyntheticEvent, detail: RadioProps) => {
    saveIsCollect(detail.value as string);
  }, []);

  const handleChangeComment = useCallback((e: SyntheticEvent, detail: TextAreaProps) => {
    saveComment(detail.value as string);
  }, []);

  const renderHeader = useCallback(() => {
    if (status === 'PASS') {
      return intl.formatMessage({id: 'targeting.approval.modal.accept'});
    } else if (status === 'REVOKE') {
      return intl.formatMessage({id: 'targeting.approval.modal.withdraw'});
    } else if (status === 'REJECT') {
      return intl.formatMessage({id: 'targeting.approval.modal.reject'});
    } else if (status === 'JUMP') {
      return intl.formatMessage({id: 'targeting.approval.operation.skip.approval'});
    } else if (status === 'CANCEL') {
      return intl.formatMessage({id: 'targeting.approval.operation.abandon'});
    } else if (status === 'PUBLISH') {
      return intl.formatMessage({id: 'targeting.approval.operation.publish'});
    }
  }, [intl, status]);

  const renderPlaceHolder = useCallback(() => {
    if (status === 'JUMP') {
      return intl.formatMessage({id: 'targeting.approval.skip.reason'});
    } else if (status === 'REVOKE') {
      return intl.formatMessage({id: 'targeting.approval.withdraw.reason'});
    } else if (status === 'REJECT') {
      return intl.formatMessage({id: 'targeting.approval.decline.reason'});
    } else if (status === 'PASS') {
      return intl.formatMessage({id: 'targeting.approval.accept.reason'});
    } else if (status === 'CANCEL') {
      return intl.formatMessage({id: 'targeting.approval.abandon.reason'});
    } else {
      return intl.formatMessage({id: 'targeting.approval.modal.reason'});
    }
  }, [intl, status]);

  return (
    <span>
      {
        enableApproval && toggleStatus === 'PENDING' && (
          <>
            {/* Skip Approval and Publish */}
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

            {/* Withdraw */}
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

            {/* Decline and Accept */}
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

      {/* Abandon */}
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

      {/* Publish */}
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
      
      {/* Abandon & Modify */}
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

      <Modal open={open} width={480} footer={null}>
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              { renderHeader() }
            </span>
            <Icon customclass={styles['modal-header-icon']} type='close' onClick={() => { 
              setValue('reason', '');
              setValue('isTrackEvent', '');
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
                          name='isTrackEvent'
                          value='yes'
                          checked={isCollect === 'yes'}
                          error={errors.isTrackEvent ? true : false}
                          onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                            handleCollectChange(e, detail);
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
                          error={errors.isTrackEvent ? true : false}
                          onChange={async (e: SyntheticEvent, detail: RadioProps) => {
                            handleCollectChange(e, detail);
                            setValue(detail.name || 'isTrackEvent', detail.value);
                            await trigger('isTrackEvent');
                          }}
                        />
                      </Form.Field>
                    </div>
                    {errors.isTrackEvent && (
                      <div className="error-text">
                        <FormattedMessage id="analysis.select.placeholder" />
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
                        { renderPlaceHolder() }:
                      </label>
                      
                      <Form.TextArea
                        name='reason'
                        error={errors.reason ? true : false}
                        value={comment} 
                        placeholder={renderPlaceHolder()}
                        className={styles.input}
                        onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                          handleChangeComment(e, detail);
                          setValue(detail.name, detail.value);
                          await trigger('reason');
                        }}
                      />
                    </Form.Field>
                    { errors.reason && <div className={styles['error-text']}>{ renderPlaceHolder() }</div> }
                  </>
                )
              }
              <div className={styles['footer']} onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
                <Button size='mini' basic type='reset' onClick={() => { 
                  setValue('reason', '');
                  setValue('isTrackEvent', '');
                  saveOpen(false); 
                }}>
                  <FormattedMessage id='common.cancel.text' />
                </Button>
                <Button primary size='mini' className={styles['footer-btn']} type='submit'>
                  <FormattedMessage id='common.confirm.text' />
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </span>
  );
};

export default ApprovalOperation;
