import { SyntheticEvent, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import TextLimit from 'components/TextLimit';
import DeleteTipsModal from 'components/DeleteTipsModal';
import { ISegment, IToggleList } from 'interfaces/segment';
import { deleteSegment, getSegmentUsingToggles } from 'services/segment';
import message from 'components/MessageBox';
import { segmentContainer } from '../../provider';
import styles from './index.module.scss';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface IProps {
  segment: ISegment;
  fetchSegmentLists(): void;
  handleEdit: (segmentKey: string) => void;
  handleClickItem: (segmentKey: string) => void;
}

const ToggleItem = (props: IProps) => {
  const { segment, fetchSegmentLists, handleEdit, handleClickItem } = props;
  const [ open, setOpen ] = useState<boolean>(false);
  const [ canDelete, setCanDelete ] = useState<boolean>(false);
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

  const checkSegmentDelete = useCallback((segmentKey: string) => {
    getSegmentUsingToggles<IToggleList>(projectKey, segmentKey, {
      pageIndex: 0,
      pageSize: 10,
    }).then((res) => {
      const { success, data } = res;
      if (success && data) {
        const { totalElements } = data;
        if (totalElements > 0) {
          setCanDelete(false);
        } else {
          setCanDelete(true);
        }
        setOpen(true);
      }
    });
  }, [projectKey]);

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
            }>
            <FormattedMessage id='common.edit.text' />
          </div>
          <div 
            className={styles['toggle-operation-item']} 
            onClick={(e: SyntheticEvent) => {
              document.body.click();
              e.stopPropagation();
              checkSegmentDelete(segment?.key);
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
        onConfirm={() => {
          canDelete ? confirmDeleteSegment(segment.key) : setOpen(false);
        }}
        content={
          !canDelete && <FormattedMessage id='segments.modal.cannot.delete.text' />
        }
        title={
          canDelete ? <FormattedMessage id='segments.modal.delete.title' /> : <FormattedMessage id='segments.modal.cannot.delete.title' />
        }
        renderFooter={(buttons) => {
          return canDelete ? buttons : [buttons[1]];
        }}
      />
    </Table.Row>
	);
};

export default ToggleItem;
