import { SyntheticEvent, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { PaginationProps, Table } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import TextLimit from 'components/TextLimit';
import Button from 'components/Button';
import DeleteTipsModal from 'components/DeleteTipsModal';
import { ISegment, IToggle, IToggleList } from 'interfaces/segment';
import { deleteSegment, getSegmentUsingToggles } from 'services/segment';
import message from 'components/MessageBox';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import { segmentContainer } from '../../provider';
import ToggleList from 'pages/segmentEdit/components/ToggleList';

import styles from './index.module.scss';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
}

interface IProps {
  segment: ISegment;
  fetchSegmentLists(): void;
  handleEdit: (segmentKey: string) => void;
  handleClickItem: (segmentKey: string) => void;
}

const ToggleItem = (props: IProps) => {
  const { segment, fetchSegmentLists, handleEdit, handleClickItem } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [canNotDeleteOpen, setCanNotDeleteOpen] = useState<boolean>(false);
  const [currentSegmentKey, setCurrentKey] = useState<string>('');
  const [toggleList, setToggleList] = useState<IToggle[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const { projectKey } = useParams<ILocationParams>();
  const intl = useIntl();

  const { 
    saveSegmentInfo,
    saveOriginSegmentInfo,
  } = segmentContainer.useContainer();

  const gotoEditing = useCallback((segment: ISegment) => {
    saveOriginSegmentInfo(cloneDeep(segment));
    saveSegmentInfo(cloneDeep(segment));
    handleEdit(segment.key);
  }, [saveOriginSegmentInfo, saveSegmentInfo, handleEdit]);

  const fetchToggleList = useCallback(async (segmentKey: string, searchParams: ISearchParams) => {
    return await getSegmentUsingToggles<IToggleList>(projectKey, segmentKey, searchParams).then((res) => {
      const { success, data } = res;
      if (success && data) {
        const { content, pageable, totalPages, totalElements } = data;
        if (totalElements > 0) {
          setCanNotDeleteOpen(true);
        } else {
          setOpen(true);
        }

        setToggleList(content);
        setPagination({
          pageIndex: (pageable?.pageNumber || 0) + 1,
          totalPages: totalPages || 1,
        });
        setTotal(totalElements || 0);
      } else {
        setToggleList([]);
        setPagination({
          pageIndex: 1,
          totalPages: 1,
        });
        setTotal(0);
        message.error(intl.formatMessage({ id: 'toggles.list.error.text' }));
      }
    });
  }, [projectKey, intl]);

  const checkSegmentDelete = useCallback((segmentKey: string) => {
    fetchToggleList(segmentKey, {
      pageIndex: 0,
      pageSize: 5,
    });
  }, [fetchToggleList]);

  const handlePageChange = useCallback(
    (e: SyntheticEvent, data: PaginationProps) => {
      fetchToggleList(currentSegmentKey, {
        pageIndex: Number(data.activePage) - 1,
        pageSize: 5,
      });
    },
    [currentSegmentKey, fetchToggleList]
  );

  const handleGotoToggle = useCallback(
    (envKey: string, toggleKey: string) => {
      window.open(`/${projectKey}/${envKey}/${toggleKey}/targeting`);
    },
    [projectKey]
  );

  const confirmDeleteSegment = useCallback((segmentKey: string) => {
    deleteSegment(projectKey, segmentKey).then(res => {
      if (res.success) {
        message.success(intl.formatMessage({id: 'segments.delete.success'}));
        fetchSegmentLists();
      } else {
        message.error(intl.formatMessage({id: 'segments.delete.error'}));
      }
      setOpen(false);
    });
  }, [intl, projectKey, fetchSegmentLists]);

	return (
    <Table.Row
      className={styles['list-item']}
      onClick={() => handleClickItem(segment.key)}
    >
      <Table.Cell>
        <div className={styles['toggle-info']}>
          <div className={styles['toggle-info-name']}>
            {segment.name}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-modified-by']}>
          {segment.key}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-modified-time']}>
          <TextLimit text={segment.description ? segment.description : '-'} maxWidth={474} />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-operation']}>
          <div 
            className={styles['toggle-operation-item']} 
            onClick={(e) => {
              e.stopPropagation();
              gotoEditing(segment);}
            }
          >
            <FormattedMessage id='common.edit.text' />
          </div>
          <div 
            className={styles['toggle-operation-item']} 
            onClick={(e: SyntheticEvent) => {
              document.body.click();
              e.stopPropagation();
              checkSegmentDelete(segment?.key);
              setCurrentKey(segment.key);
            }}
          >
            <FormattedMessage id='common.delete.text' />
          </div>
        </div>
      </Table.Cell>
      <DeleteTipsModal 
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={() => {confirmDeleteSegment(segment.key);}}
        content={null}
        title={<FormattedMessage id='segments.modal.delete.title' />}
        renderFooter={(buttons) => {
          return buttons;
        }}
      />
      <Modal
        open={canNotDeleteOpen}
        width={800} 
        footer={
          <div className={styles['modal-footer']}>
            <Button
              key="confirm"
              primary
              onClick={async (e: SyntheticEvent) => {
                e.stopPropagation();
                setCanNotDeleteOpen(false);
              }}
            >
              <FormattedMessage id="common.confirm.text" />
            </Button>
          </div>
        }
      >
        <div className={styles['modal-inner-box']}>
          <div className={styles['modal-header']}>
            <span>
              <FormattedMessage id="segments.modal.cannot.delete.title" />
            </span>
            <Icon
              customclass={styles['modal-header-icon']}
              type="close"
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                setCanNotDeleteOpen(false);
              }}
            />
          </div>
          <>
            <div className={styles['modal-tips']}>
              <Icon type="remove-circle" customclass={styles['modal-info-circle']} />
              {intl.formatMessage({ id: 'segments.modal.cannot.delete.text'}, { count: total })}
            </div>
            <div className={styles['modal-not-delete-content']}>
              <ToggleList 
                total={total}
                pagination={pagination}
                toggleList={toggleList}
                handlePageChange={handlePageChange}
                handleGotoToggle={handleGotoToggle}
              />
            </div>
          </>
        </div>
      </Modal>
    </Table.Row>
	);
};

export default ToggleItem;
