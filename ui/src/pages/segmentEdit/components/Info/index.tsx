import { SyntheticEvent, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Form, Button, PaginationProps, Loader, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams, Prompt, useRouteMatch } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useFormErrorScrollIntoView } from 'hooks';
import useResizeObserver from 'use-resize-observer';
import message from 'components/MessageBox';
import EventTracker from 'components/EventTracker';
import Modal from 'components/Modal';
import { DATETIME_TYPE, NUMBER_TYPE } from 'components/Rule/constants';
import TextLimit from 'components/TextLimit';
import History from 'components/History';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import SizeTips from 'components/SizeTips';
import Rules from 'pages/targeting/components/Rules';
import { useBeforeUnload } from 'pages/targeting/hooks';
import ConfirmModal from '../Modal';
import { ruleContainer, hooksFormContainer, segmentContainer } from '../../provider';
import { getSegmentDetail, confirmPublishSegment, getSegmentUsingToggles, getSegmentVersion } from 'services/segment';
import { ISegmentInfo, IToggleList, IToggle, ISegmentVersion, ISegmentVersions } from 'interfaces/segment';
import { SEGMENT_EDIT_PATH } from 'router/routes';
import { IRule, ICondition } from 'interfaces/targeting';
import { IVersionParams } from 'interfaces/project';
import { getBytes, MAX_SIZE } from 'utils/bytes';
import styles from './index.module.scss';

interface IParams {
  projectKey: string;
  environmentKey: string;
  segmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
}

const Info = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [initialSegment, saveInitialSegment] = useState<ISegmentInfo>();
  const [publishSegment, savePublishSegment] = useState<ISegmentInfo>();
  const [publishDisabled, setPublishDisabled] = useState<boolean>(true);
  const { projectKey, segmentKey } = useParams<IParams>();
  const [searchParams, setSearchParams] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [toggleList, setToggleList] = useState<IToggle[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [version, saveVersion] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPageLoading, saveIsLoading] = useState<boolean>(false);
  const [isHistoryLoading, setHistoryLoading] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [versions, saveVersions] = useState<ISegmentVersion[]>([]);
  const [historyHasMore, saveHistoryHasMore] = useState<boolean>(false);
  const [selectedVersion, saveSelectedVersion] = useState<number>(0);
  const [latestVersion, saveLatestVersion] = useState<number>(0);
  const [targetingDisabled, saveTargetingDisabled] = useState<boolean>(false);
  const [historyPageIndex, saveHistoryPageIndex] = useState<number>(0);
  const [activeVersion, saveActiveVersion] = useState<ISegmentVersion>();
  const [pageLeaveOpen, setPageLeaveOpen] = useState<boolean>(false);
  const [pageInitCount, saveCount] = useState<number>(0);
  const [diffContent, setDiffContent] = useState<{
    before?: unknown;
    after?: unknown;
  }>({});
  const [comment, saveComment] = useState<string>('');
  const [size, saveSize] = useState<number>(0);
  const [sizeConfirm, setSizeConfirm] = useState<boolean>(false);
  const { ref, height = 1 } = useResizeObserver<HTMLDivElement>();
  const formRef = useRef();
  const intl = useIntl();
  const match = useRouteMatch();
  const { rules, saveRules } = ruleContainer.useContainer();
  const { segmentInfo, saveSegmentInfo, saveOriginSegmentInfo } = segmentContainer.useContainer();

  const {
    formState: { errors },
    setValue,
    setError,
    handleSubmit,
  } = hooksFormContainer.useContainer();

  const { scrollToError, setBeforeScrollCallback } = useFormErrorScrollIntoView(errors);

  useBeforeUnload(!publishDisabled, intl.formatMessage({ id: 'targeting.page.leave.text' }));

  const getSegmentInfo = useCallback(() => {
    getSegmentDetail<ISegmentInfo>(projectKey, segmentKey).then((res) => {
      const { data, success } = res;
      saveIsLoading(false);
      if (success && data) {
        saveInitialSegment({
          name: data.name,
          key: data.key,
          description: data.description,
          rules: cloneDeep(data.rules),
        });
        saveSegmentInfo(cloneDeep(data));
        saveOriginSegmentInfo(cloneDeep(data));
        const targetRule = cloneDeep(data.rules);
        targetRule.forEach((rule: IRule) => {
          rule.id = uuidv4();
          rule.conditions.forEach((condition: ICondition) => {
            condition.id = uuidv4();
            if (condition.type === DATETIME_TYPE && condition.objects) {
              condition.datetime = condition.objects[0].slice(0, 19);
              condition.timezone = condition.objects[0].slice(19);
            }
          });
          rule.active = true;
        });

        saveRules(targetRule);
        saveVersion(data.version ?? 0);
      } else {
        message.error(intl.formatMessage({ id: 'toggles.targeting.error.text' }));
      }
    });
  }, [intl, projectKey, saveOriginSegmentInfo, saveRules, saveSegmentInfo, segmentKey]);

  useEffect(() => {
    if (match.path === SEGMENT_EDIT_PATH) {
      saveIsLoading(true);
      getSegmentInfo();
    }
  }, [match.path, getSegmentInfo]);

  useEffect(() => {
    const requestRules = cloneDeep(rules);
    requestRules?.forEach((rule: IRule) => {
      rule?.conditions?.forEach((condition: ICondition) => {
        delete condition.id;

        if (condition.type === DATETIME_TYPE) {
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

    savePublishSegment({
      name: segmentInfo.name,
      key: segmentInfo.key,
      description: segmentInfo.description,
      rules: requestRules,
    });
  }, [segmentInfo, rules]);

  // Check if the size of the data is too large
  useEffect(() => {
    if (publishSegment) {
      const bytes = getBytes(JSON.stringify(publishSegment.rules));
      saveSize(bytes);
    }
  }, [publishSegment]);

  const sizeState = useMemo(() => {
    let state = 'normal';
    if (size >= MAX_SIZE) {
      state = 'large';
    } else if (size > MAX_SIZE * 0.8) {
      state = 'near';
    }
    return state;
  }, [size]);

  useEffect(() => {
    setValue('name', segmentInfo?.name);
    setValue('key', segmentInfo?.key);

    rules.forEach((rule: IRule) => {
      rule.conditions?.forEach((condition: ICondition) => {
        setValue(`rule_${rule.id}_condition_${condition.id}_subject`, condition.subject);
        setValue(`rule_${rule.id}_condition_${condition.id}_predicate`, condition.predicate);
        if (condition.type === DATETIME_TYPE) {
          if (condition.objects) {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, condition.objects[0].slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, condition.objects[0].slice(19));
          } else {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, moment().format().slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, moment().format().slice(19));
          }
        } else if (condition.type === NUMBER_TYPE) {
          if (condition.predicate === 'between') {
            setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
            setValue(`rule_${rule.id}_condition_${condition.id}_rightObjects`, condition.rightObjects);
            setValue(`rule_${rule.id}_condition_${condition.id}_leftPredicate`, condition.leftPredicate);
            setValue(`rule_${rule.id}_condition_${condition.id}_rightPredicate`, condition.rightPredicate);
          } else {
            setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
          }
        } 
        else {
          setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
        }
      });
    });
  }, [rules, segmentInfo, setValue]);

  useEffect(() => {
    const isSame = isEqual(initialSegment, publishSegment);
    setPublishDisabled(isSame);
  }, [initialSegment, publishSegment]);

  const getVersionsList = useCallback(
    async (page?: number) => {
      const params: IVersionParams = {
        pageIndex: page ?? historyPageIndex,
        pageSize: 10,
      };

      getSegmentVersion<ISegmentVersions>(projectKey, segmentKey, params).then((res) => {
        setHistoryLoading(false);
        const { data, success } = res;
        if (success && data) {
          const { content, number, totalPages, version, first } = data;
          saveVersions(versions.concat(content));
          saveHistoryPageIndex(historyPageIndex + 1);
          saveHistoryHasMore(number + 1 !== totalPages);

          if (version) {
            saveSelectedVersion(version);
            saveLatestVersion(version);
          } else {
            if (first) {
              saveSelectedVersion(content[0].version);
              saveLatestVersion(content[0].version);
            }
          }
        } else {
          message.error(res.message || intl.formatMessage({ id: 'targeting.get.versions.error' }));
        }
      });
    },
    [historyPageIndex, intl, projectKey, segmentKey, versions]
  );

  const initHistory = useCallback(() => {
    saveVersions([]);
    saveHistoryPageIndex(0);
    getVersionsList(0);
    // NOTICE: Do not add getVersionsList as dependency, or there will be a bug
    // eslint-disable-next-line
  }, []);

  const confirmEditSegment = useCallback(async () => {
    if (publishSegment) {
      setLoading(true);
      const res = await confirmPublishSegment(projectKey, segmentKey, {
        ...publishSegment,
        comment: comment,
        baseVersion: version,
      });
      setLoading(false);
      if (res.success) {
        message.success(intl.formatMessage({ id: 'segments.edit.success' }));
        getSegmentInfo();
        initHistory();
      } else {
        message.error(res.message || intl.formatMessage({ id: 'segments.edit.error' }));
      }
    }
  }, [publishSegment, projectKey, segmentKey, comment, version, intl, getSegmentInfo, initHistory]);

  const fetchToggleList = useCallback(async () => {
    return await getSegmentUsingToggles<IToggleList>(projectKey, segmentKey, searchParams).then((res) => {
      const { success, data } = res;
      if (success && data) {
        const { content, pageable, totalPages, totalElements } = data;
        setToggleList(content);
        setPagination({
          pageIndex: (pageable?.pageNumber || 0) + 1,
          totalPages: totalPages || 1,
        });
        setTotal(totalElements || 0);
        const before = initialSegment?.rules;
        const after = publishSegment?.rules;
        setDiffContent({
          before,
          after,
        });
      } else {
        setToggleList([]);
        setPagination({
          pageIndex: 1,
          totalPages: 1,
        });
        setTotal(0);
        message.error(intl.formatMessage({ id: 'toggles.list.error.text' }));
      }
      setLoading(false);
    });
  }, [projectKey, segmentKey, searchParams, initialSegment, publishSegment, intl]);

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

    return isError;
  }, [intl, rules, setError]);

  const onSubmit = useCallback(async () => {
    if (validateForm()) {
      return;
    }

    if(sizeState === 'large') {
      message.error(intl.formatMessage({id: 'targeting.size.tips'}, { size: Math.floor(size / 1024) }));
      return;
    }

    setLoading(true);
    await fetchToggleList();
    setOpen(true);
  }, [validateForm, sizeState, fetchToggleList, intl, size]);

  const onError = useCallback(() => {
    validateForm();
    scrollToError();
  }, [scrollToError, validateForm]);

  const handlePageChange = useCallback(
    (e: SyntheticEvent, data: PaginationProps) => {
      setSearchParams({
        ...searchParams,
        pageIndex: Number(data.activePage) - 1,
      });
    },
    [searchParams]
  );

  const reviewHistory = useCallback(
    (version: ISegmentVersion) => {
      saveActiveVersion(version);
      if (pageInitCount === 0 && !publishDisabled) {
        setPageLeaveOpen(true);
        return;
      }

      saveCount(pageInitCount + 1);
      saveSelectedVersion(version?.version || 0);
      const targetRule = cloneDeep(version.rules);
      targetRule.forEach((rule: IRule) => {
        rule.id = uuidv4();
        rule.conditions.forEach((condition: ICondition) => {
          condition.id = uuidv4();
          if (condition.type === DATETIME_TYPE && condition.objects) {
            condition.datetime = condition.objects[0].slice(0, 19);
            condition.timezone = condition.objects[0].slice(19);
          }
        });
        rule.active = true;
      });

      saveRules(targetRule);
      if (version.version === latestVersion) {
        saveCount(0);
        saveTargetingDisabled(false);
      } else {
        saveTargetingDisabled(true);
      }
    },
    [pageInitCount, publishDisabled, saveRules, latestVersion]
  );

  const confirmReviewHistory = useCallback(() => {
    if (activeVersion) {
      saveSelectedVersion(activeVersion?.version || 0);
      saveRules(
        activeVersion.rules.map((item) => {
          item.active = true;
          return item;
        })
      );
    }
    saveCount(pageInitCount + 1);
    saveTargetingDisabled(true);
    setPageLeaveOpen(false);
  }, [activeVersion, pageInitCount, saveRules]);

  const quiteReviewHistory = useCallback(() => {
    saveTargetingDisabled(false);
    saveSelectedVersion(versions[0].version);
    saveActiveVersion(versions[0]);
    saveCount(0);
    const targetRule = cloneDeep(versions[0].rules);
    targetRule.forEach((rule: IRule) => {
      rule.id = uuidv4();
      rule.conditions.forEach((condition: ICondition) => {
        condition.id = uuidv4();
        if (condition.type === DATETIME_TYPE && condition.objects) {
          condition.datetime = condition.objects[0].slice(0, 19);
          condition.timezone = condition.objects[0].slice(19);
        }
      });
      rule.active = true;
    });
    saveRules(targetRule);
  }, [saveRules, versions]);

  const handleInputComment = useCallback((e: SyntheticEvent, data: TextAreaProps) => {
    saveComment(data.value + '');
  }, []);

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

  return (
    <>
      <div className={styles.heading}>
        <span>{segmentInfo.name}</span>
        <Button
          secondary
          type="button"
          onClick={() => {
            setHistoryOpen(!isHistoryOpen);
            if (!versions.length) {
              setHistoryLoading(true);
              getVersionsList();
            }
          }}
        >
          {isHistoryOpen ? (
            <Icon type="put-up" customclass={styles['put-away']} />
          ) : (
            <Icon type="put-away" customclass={styles['put-away']} />
          )}
          <FormattedMessage id="common.history.text" />
        </Button>
      </div>
      <div className={styles.content} ref={ref}>
        {isPageLoading ? (
          <Loading />
        ) : (
          <Form
            className={styles['filter-form']}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit, onError)}
            ref={formRef}
          >
            {targetingDisabled && (
              <div className={styles.message}>
                <div className={`${styles['message-content-warn']} ${styles['message-content']}`}>
                  <i className={`${styles['icon-warning-circle']} icon-warning-circle iconfont`}></i>
                  <span className={styles['message-content-text']}>
                    <FormattedMessage id="targeting.view.versions" />
                    <FormattedMessage id="common.version.text" />:{selectedVersion}
                  </span>
                  <Icon type="close" customclass={styles['close-icon']} onClick={() => quiteReviewHistory()} />
                </div>
              </div>
            )}

            <div className={styles['segment-info']}>
              <div className={styles['segment-info-item']}>
                <div className={styles['info-title']}>
                  <FormattedMessage id="common.key.text" />
                </div>
                <div className={styles['info-value']}>{segmentKey}</div>
              </div>
              <div className={styles['segment-info-item']}>
                <div className={styles['info-title']}>
                  <FormattedMessage id="common.description.text" />
                </div>
                <div className={styles['info-value']}>
                  <TextLimit text={segmentInfo.description ? segmentInfo.description : '-'} />
                </div>
              </div>
            </div>

            <div className={styles.rules}>
              <Rules
                useSegment={false}
                ruleContainer={ruleContainer}
                hooksFormContainer={hooksFormContainer}
                disabled={targetingDisabled}
              />
            </div>

            <div id="footer" className={styles.footer}>
              <EventTracker category="segment" action="publish-segment">
                <Button
                  primary
                  type="submit"
                  className={styles['publish-btn']}
                  disabled={publishDisabled || Object.keys(errors).length !== 0 || isLoading || targetingDisabled}
                >
                  {isLoading && <Loader inverted active inline size="tiny" className={styles['publish-btn-loader']} />}
                  <FormattedMessage id="common.publish.text" />
                </Button>
              </EventTracker>
            </div>

            <ConfirmModal
              open={open}
              total={total}
              diff={diffContent}
              toggleList={toggleList}
              pagination={pagination}
              setOpen={setOpen}
              handlePageChange={handlePageChange}
              confirmEditSegment={confirmEditSegment}
              handleInputComment={handleInputComment}
            />
            <Modal
              open={pageLeaveOpen}
              width={400}
              handleCancel={() => {
                setPageLeaveOpen(false);
              }}
              handleConfirm={confirmReviewHistory}
            >
              <div>
                <div className={styles['modal-header']}>
                  <Icon customclass={styles['warning-circle']} type="warning-circle" />
                  <span className={styles['modal-header-text']}>
                    <FormattedMessage id="sidebar.modal.title" />
                  </span>
                </div>
                <div className={styles['modal-content']}>
                  <FormattedMessage id="targeting.page.leave.text" />
                </div>
              </div>
            </Modal>

            <Prompt when={!publishDisabled} message={intl.formatMessage({ id: 'targeting.page.leave.text' })} />
          </Form>
        )}
        {isHistoryOpen && (
          <div style={{ height: height }} className={styles['content-right']}>
            <History
              versions={versions}
              hasMore={historyHasMore}
              isHistoryLoading={isHistoryLoading}
              latestVersion={latestVersion}
              selectedVersion={selectedVersion}
              loadMore={() => {
                getVersionsList();
              }}
              reviewHistory={reviewHistory}
            />
          </div>
        )}
      </div>
      <SizeTips hide={sizeConfirm || sizeState === 'normal'} size={size} onConfirm={() => {
        setSizeConfirm(true);
      }} />
    </>
  );
};

export default Info;
