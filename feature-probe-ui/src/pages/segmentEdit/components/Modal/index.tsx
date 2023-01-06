import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { PaginationProps, Button, Form, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import Diff from 'components/Diff';
import { IToggle } from 'interfaces/segment';
import { I18NRules, RulesDiffContent } from 'components/Diff/RulesDiffContent';
import { hooksFormContainer } from 'pages/segmentEdit/provider';
import ToggleList from '../ToggleList';

import styles from './index.module.scss';

interface IPagination {
  pageIndex: number;
  totalPages: number;
}

interface IProps {
  open: boolean;
  total: number;
  diff: {
    before?: unknown;
    after?: unknown;
  };
  toggleList: IToggle[];
  pagination: IPagination;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePageChange(e: SyntheticEvent, data: PaginationProps): void;
  confirmEditSegment(): Promise<void>;
  handleInputComment: (e: SyntheticEvent, data: TextAreaProps) => void;
}

interface IParams {
  projectKey: string;
  environmentKey: string;
}

const ConfirmModal = (props: IProps) => {
  const {
    open,
    total,
    toggleList,
    pagination,
    diff,
    setOpen,
    handlePageChange,
    confirmEditSegment,
    handleInputComment,
  } = props;
  const intl = useIntl();
  const { projectKey } = useParams<IParams>();
  const [steps] = useState<string[]>(['toggle', 'diff']);
  const [current, setCurrent] = useState<number>(0);

  const { register, formState, setValue, trigger } = hooksFormContainer.useContainer();

  useEffect(() => {
    register('reason');
  }, [register]);

  const handleGotoToggle = useCallback(
    (envKey: string, toggleKey: string) => {
      window.open(`/${projectKey}/${envKey}/${toggleKey}/targeting`);
    },
    [projectKey]
  );

  const next = useCallback(() => {
    setCurrent((current) => (current + 1 < steps.length ? current + 1 : current));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrent((current) => (current - 1 >= 0 ? current - 1 : current));
  }, []);

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      setOpen(false);
      setCurrent(0);
    },
    [setOpen]
  );

  const modalFooter = () => {
    if (current === 0) {
      return (
        <div className={styles['modal-footer']}>
          <Button key="cancel" basic onClick={handleCancel}>
            <FormattedMessage id="common.cancel.text" />
          </Button>
          <Button key="next" onClick={next} primary>
            <FormattedMessage id="common.next.text" />
          </Button>
        </div>
      );
    } else if (current === 1) {
      return (
        <div className={styles['modal-footer']}>
          <Button key="cancel" basic onClick={handleCancel}>
            <FormattedMessage id="common.cancel.text" />
          </Button>
          <Button key="prev" basic onClick={prev}>
            <FormattedMessage id="common.previous.text" />
          </Button>
          <Button
            key="confirm"
            primary
            onClick={async (e: SyntheticEvent) => {
              e.stopPropagation();
              setOpen(false);
              await confirmEditSegment();
              setCurrent(0);
            }}
          >
            <FormattedMessage id="common.confirm.text" />
          </Button>
        </div>
      );
    }
  };

  const beforeRuleDiff = useCallback(
    (before, after) => {
      const left = I18NRules(before, intl);
      const right = I18NRules(after, intl);
      return [left, right];
    },
    [intl]
  );

  return (
    <Modal handleCancel={handleCancel} open={open} width={800} footer={modalFooter()}>
      <div className={styles['modal-inner-box']}>
        <div className={styles['modal-header']}>
          <span>
            <FormattedMessage id="targeting.publish.modal.title" />
          </span>
          <Icon
            customclass={styles['modal-header-icon']}
            type="close"
            onClick={(e: SyntheticEvent) => {
              setCurrent(0);
              e.stopPropagation();
              setOpen(false);
            }}
          />
        </div>
        {steps[current] === 'toggle' && (
          <>
            <div className={styles['modal-tips']}>
              <Icon type="info-circle" customclass={styles['modal-info-circle']} />
              {intl.formatMessage({ id: 'segments.modal.delete.tips'}, { count: total })}
            </div>
            <div className={styles['modal-content']}>
              <ToggleList 
                total={total}
                pagination={pagination}
                toggleList={toggleList}
                handlePageChange={handlePageChange}
                handleGotoToggle={handleGotoToggle}
              />
            </div>
          </>
        )}
        {steps[current] === 'diff' && (
          <>
            <div className={styles['diff-box']}>
              <Diff
                sections={[
                  {
                    before:diff.before,
                    after:diff.after,
                    title: intl.formatMessage({ id: 'common.rules.text' }),
                    renderContent: (content) => {
                      return <RulesDiffContent content={content} />;
                    },
                    beforeDiff: beforeRuleDiff,
                    diffKey: 'rules'
                  }
                ]}
                maxHeight={343}
              />
            </div>

            <Form>
              <div className={styles['comment']}>
                <div className={styles['comment-title']}>
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
                    <div className={styles['error-text']}>
                      <FormattedMessage id="common.input.placeholder" />
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
