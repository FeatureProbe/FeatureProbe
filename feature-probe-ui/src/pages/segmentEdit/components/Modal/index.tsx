import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Table, PaginationProps, Button, Form, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import Diff from 'components/Diff';
import Pagination from 'components/Pagination';
import NoData from 'components/NoData';
import { IToggle } from 'interfaces/segment';
import TextLimit from 'components/TextLimit';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { hooksFormContainer } from 'pages/segmentEdit/provider';
import styles from './index.module.scss';

interface IPagination {
  pageIndex: number;
  totalPages: number;
}

interface IProps {
  open: boolean;
  total: number;
  diff: string;
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
  const { open, total, toggleList, pagination, setOpen, handlePageChange, confirmEditSegment, diff, handleInputComment } = props;
  const intl = useIntl();
  const { projectKey } = useParams<IParams>();
  const [ steps ] = useState<string[]>(['toggle', 'diff']);
  const [ current, setCurrent ] = useState<number>(0);

  const {
    register,
    formState,
    setValue,
    trigger
  } = hooksFormContainer.useContainer();

  useEffect(() => {
    register('reason');
  }, [register]);

  const handleGotoToggle = useCallback((envKey: string, toggleKey: string) => {
    window.open(`/${projectKey}/${envKey}/${toggleKey}/targeting`);
  }, [projectKey]);

  const next = useCallback(() => {
    setCurrent((current) => current + 1 < steps.length ? current + 1 : current);
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrent((current) => current - 1 >= 0 ? current - 1 : current);
  }, []);

  const handleCancel = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen(false);
    setCurrent(0);
  }, [setOpen]);

  const modalFooter = () => {
    if(current === 0) {
      return (
        <div className={styles['modal-footer']}>
          <Button key='cancel' basic onClick={handleCancel}><FormattedMessage id='common.cancel.text' /></Button>
          <Button key='next' onClick={next} primary><FormattedMessage id='common.next.text' /></Button>
        </div>
      );
    } else if(current === 1) {
      return (
        <div className={styles['modal-footer']}>
          <Button key='cancel' basic onClick={handleCancel}><FormattedMessage id='common.cancel.text' /></Button>
          <Button key='prev' basic onClick={prev}><FormattedMessage id='common.previous.text' /></Button>
          <Button 
            key='confirm'
            primary
            onClick={async (e: SyntheticEvent) => {
              e.stopPropagation();
              setOpen(false);
              await confirmEditSegment();
              setCurrent(0);
            }}
          >
            <FormattedMessage id='common.confirm.text' />
          </Button>
        </div>
      );
    }
  };

	return (
    <Modal 
      open={open}
      width={800}
      footer={modalFooter()}
    >
      <div className={styles['modal-inner-box']}>
        <div className={styles['modal-header']}>
          <span><FormattedMessage id='targeting.publish.modal.title' /></span>
          <Icon customclass={styles['modal-header-icon']} type='close' onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            setOpen(false);
          }} />
        </div>
        {
          steps[current] === 'toggle' && (
            <>
              <div className={styles['modal-tips']}>
                <Icon type='info-circle' customclass={styles['modal-info-circle']} />
                {
                  intl.formatMessage({
                    id: 'segments.modal.delete.tips',
                  }, {
                    count: total
                  })
                }
              </div>
              <div className={styles['modal-content']}>
                <Table basic='very' unstackable >
                  <Table.Header className={styles['table-header']}>
                    <Table.Row>
                      <Table.HeaderCell className={styles['column-toggle']}>
                        <FormattedMessage id='common.toggle.text' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-environment']}>
                        <FormattedMessage id='common.environment.text' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-status']}>
                        <FormattedMessage id='toggles.table.status' />
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      toggleList?.map((toggle: IToggle) => {
                        const listItem = classNames(
                          styles['list-item'],
                          {
                            [styles['list-item-enabled']]: !toggle.disabled
                          }
                        );

                        return (
                          <Table.Row 
                            key={toggle.key} 
                            className={listItem}
                            onClick={() => {handleGotoToggle(toggle.environmentKey, toggle.key);}} 
                          >
                            <Table.Cell>
                              <div className={styles['toggle-info']}>
                                <div className={styles['toggle-info-name']}>
                                  <TextLimit text={toggle.name} maxWidth={150} />
                                </div>
                                <div className={styles['toggle-info-key']}>
                                  <CopyToClipboardPopup text={toggle.key}>
                                    <div onClick={(e) => {e.stopPropagation();}} className={styles['toggle-info-key-label']}>
                                      {toggle.key}
                                    </div>
                                  </CopyToClipboardPopup>
                                </div>
                              </div>
                              {
                                toggle.description && (
                                  <div className={styles['toggle-info-description']}>
                                    <TextLimit text={toggle.description} maxWidth={242} />
                                  </div>
                                )
                              }
                            </Table.Cell>
                            <Table.Cell>
                              <div className={styles['toggle-modified']}>
                                <TextLimit text={toggle?.environmentName} maxWidth={100} />
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              {
                                toggle?.disabled ? (
                                  <div className={styles['toggle-status']}>
                                    <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-disabled']}`}></div>
                                    <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-disabled']}`}>
                                      <FormattedMessage id='common.disabled.text' />
                                    </div>
                                  </div>
                                ) : (
                                  <div className={styles['toggle-status']}>
                                    <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-enabled']}`}></div>
                                    <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-enabled']}`}>
                                      <FormattedMessage id='common.enabled.text' />
                                    </div>
                                  </div>
                                ) 
                              }
                            </Table.Cell>
                          </Table.Row>
                        );
                      })
                    }
                  </Table.Body>
                </Table>
                {
                  toggleList.length !== 0 ? (
                    <Pagination
                      total={total}
                      pagination={pagination}
                      hideTotal={true}
                      text={intl.formatMessage({id: 'segments.total'})}
                      handlePageChange={handlePageChange}
                    />
                  ) : <NoData />
                }
              </div>
            </>
          )
        }
        {
          steps[current] === 'diff' && (
            <>
              <div className={styles['diff-box']}>
                <Diff content={diff} maxHeight={343} />
              </div>
              
              <Form>
                <div className={styles['comment']}>
                  <div className={styles['comment-title']}>
                      <FormattedMessage id='targeting.publish.modal.comment' />:
                    </div>
                  <div className={styles['comment-content']}>
                    <Form.TextArea
                      name='reason'
                      error={ formState.errors.reason ? true : false }
                      className={styles['comment-input']} 
                      placeholder={intl.formatMessage({id: 'common.input.placeholder'})}
                      onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                        handleInputComment(e, detail);
                        setValue(detail.name, detail.value);
                        await trigger('reason');
                      }}
                    />
                    { 
                      formState.errors.reason && (
                        <div className={styles['error-text']}>
                          <FormattedMessage id='common.input.placeholder' />
                        </div> 
                      )
                    }
                  </div>
                </div>
              </Form>
            </>
          )
        }
      </div>
    </Modal>
	);
};

export default ConfirmModal;