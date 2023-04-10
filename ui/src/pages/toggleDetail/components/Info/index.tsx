import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Grid, Popup, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import Diff from 'components/Diff';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import TextLimit from 'components/TextLimit';
import Loading from 'components/Loading';
import VariationsDiffContent from 'components/Diff/VariationsDiffContent';
import { I18NRules, RulesDiffContent } from 'components/Diff/RulesDiffContent';
import { DiffStatusContent } from 'components/Diff/DiffStatus';
import PrerequisitesDiffContent from 'components/Diff/PrerequisitesDiffContent'; 
import { DiffServe } from 'components/Diff/DiffServe';
import PopupConfirm from 'components/PopupConfirm';
import ApprovalOperation from '../ApprovalOperation';
import { defaultServeContainer, disabledServeContainer, variationContainer, ruleContainer, prerequisiteContainer } from 'pages/targeting/provider';
import { getTargetingDiff } from 'services/toggle';
import { DATETIME_TYPE, SEGMENT_TYPE } from 'components/Rule/constants';
import { IToggleInfo, IModifyInfo, IApprovalInfo, ITargetingDiff, ITargeting, ITarget, IServe, IRule, IVariation, ICondition, IPrerequisite } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';

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
  targeting?: ITarget;
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
    targeting,
    gotoGetStarted,
    initTargeting,
    saveApprovalInfo,
    saveInitTargeting,
    refreshTrackvents
  } = props;
  const [ enableApproval, saveEnableApproval ] = useState<boolean>(false);
  const [ diffOpen, saveDiffOpen ] = useState<boolean>(false);
  const [ popupOpen, savePopupOpen ] = useState<boolean>(false);
  const [ toggleStatus, saveToggleStatus ] = useState<string>(approvalInfo?.status || '');
  const [before, saveBefore] = useState<{
    disable: boolean;
    content: ITarget;
  }>();
  const [after, saveAfter] = useState<{
    disable: boolean;
    content: ITarget;
  }>();
  const [ isDiffLoading, saveIsDiffLoading ] = useState<boolean>(false);
  const { saveRules } = ruleContainer.useContainer();
  const { variations, saveVariations } = variationContainer.useContainer();
  const { saveDefaultServe } = defaultServeContainer.useContainer();
  const { saveDisabledServe } = disabledServeContainer.useContainer();
  const { savePrerequisites } = prerequisiteContainer.useContainer();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  useEffect(() => {
    if (targeting) {
      const cloneVariations = cloneDeep(targeting.variations) || [];
      cloneVariations.forEach((variation: IVariation) => {
        variation.id = uuidv4();
      });
      saveVariations(cloneVariations);

      const targetRule = cloneDeep(targeting.rules);
      targetRule.forEach((rule: IRule) => {
        rule.id = uuidv4();
        rule.conditions.forEach((condition: ICondition) => {
          condition.id = uuidv4();
          if (condition.type === SEGMENT_TYPE) {
            condition.subject = intl.formatMessage({ id: 'common.user.text' });
          } else if (condition.type === DATETIME_TYPE && condition.objects) {
            condition.datetime = condition.objects[0].slice(0, 19);
            condition.timezone = condition.objects[0].slice(19);
          }
        });
        rule.active = true;
      });

      const clonePrerequisites = cloneDeep(targeting.prerequisites) || [];
      clonePrerequisites.forEach((prerequisite: IPrerequisite) => {
        prerequisite.id = uuidv4();
      });
      savePrerequisites(clonePrerequisites);

      saveRules(targetRule);
      saveDefaultServe(targeting.defaultServe);
      saveDisabledServe(targeting.disabledServe);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targeting, saveVariations, saveRules, saveDefaultServe, saveDisabledServe]);

  useEffect(() => {
    if (approvalInfo?.status) {
      saveToggleStatus(approvalInfo.status);
      saveEnableApproval(approvalInfo.enableApproval);
    }
  }, [approvalInfo]);


  useEffect(() => {
    if (targetingDisabled) {
      saveEnableApproval(false);
    }
  }, [targetingDisabled, saveEnableApproval]);

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
        obj.select = variations[serve.select]?.name;
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
                    <div className={`${styles['connect-sdk']} connect-sdk`} onClick={gotoGetStarted}>
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

                  <ApprovalOperation
                    toggleStatus={toggleStatus}
                    approvalInfo={approvalInfo}
                    allowEnableTrackEvents={allowEnableTrackEvents}
                    enableApproval={enableApproval}
                    initTargeting={initTargeting}
                    saveInitTargeting={saveInitTargeting}
                    saveApprovalInfo={saveApprovalInfo}
                  />

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
                  before: before?.content.prerequisites ?? [],
                  after: after?.content.prerequisites ?? [],
                  title: intl.formatMessage({ id: 'common.prerequisite.text' }),
                  renderContent: (content) => {
                    return <PrerequisitesDiffContent content={content} />;
                  },
                  diffKey: 'prerequisites',
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