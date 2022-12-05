import { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Popup, Checkbox } from 'semantic-ui-react';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import message from 'components/MessageBox';
import TextLimit from 'components/TextLimit';
import { IWebHook, WebHookStatus } from 'interfaces/webhook';
import DeleteTipsModal from 'components/DeleteTipsModal';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { deleteWebHook, updateWebHook } from 'services/webhook';
import styles from './index.module.scss';
interface IProps {
  webhook: IWebHook;
  handleEdit: (key: number) => void;
  refresh: () => void;
  saveList: React.Dispatch<React.SetStateAction<IWebHook[]>>;
  index: number;
}

const WebHookItem = (props: IProps) => {
  const { webhook, handleEdit, refresh, saveList, index } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const intl = useIntl();

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const handleDelete = useCallback(() => {
    (async () => {
      try {
        const res = await deleteWebHook('' + webhook.id);
        if (res.success) {
          message.success(intl.formatMessage({ id: 'webhook.delete.success' }));
          refresh();
        } else {
          message.error(res.message || intl.formatMessage({ id: 'webhook.delete.failed' }));
        }
      } catch (err) {
        message.error(intl.formatMessage({ id: 'webhook.delete.failed' }));
      }
    })();
  }, [intl, webhook, refresh]);

  const updateStatus = useCallback(
    async (status: WebHookStatus) => {
      try {
        const res = await updateWebHook(webhook.id + '', { ...webhook, status: status });
        if (res.success) {
          message.success(intl.formatMessage({ id: 'webhook.update.success' }));
          saveList((list) => {
            list[index].status = status;
            return cloneDeep(list);
          });
        } else {
          message.error(intl.formatMessage({ id: 'webhook.update.failed' }));
        }
      } catch {
        message.error(intl.formatMessage({ id: 'webhook.update.failed' }));
      }
    },
    [webhook, saveList, index, intl]
  );

  return (
    <>
      <Table.Row
        className={styles['list-item']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => ''}
      >
        <Table.Cell>
          <div className={styles['webhook-info-name']}>
            <TextLimit text={webhook.name} maxWidth={180} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-description']}>
            <TextLimit text={webhook.description ? webhook.description : '-'} maxWidth={187} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-status']}>
            <Checkbox
              onChange={(e, data) => {
                updateStatus(data.checked ? WebHookStatus.ENABLE : WebHookStatus.DISABLE);
              }}
              checked={webhook.status === WebHookStatus.ENABLE}
              toggle
            />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-secretKey']}>
            <CopyToClipboardPopup text={webhook.secretKey ?? ''}>
              <span><TextLimit hidePopup text={webhook.secretKey ?? '-'} /></span>
            </CopyToClipboardPopup>
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-recent']}>
            <Popup
              disabled={!webhook.lastedTime}
              trigger={
                !webhook.lastedTime ? (
                  <span>-</span>
                ) : webhook.lastedStatus === 'SUCCESS' ? (
                  <span>{intl.formatMessage({ id: 'common.success.text' })}</span>
                ) : (
                  <span>{intl.formatMessage({ id: 'common.fail.text' })}</span>
                )
              }
              content={
                <span>
                  {intl.formatMessage({ id: 'webhook.status.code.text' })}:{webhook.lastedStatusCode}
                  <div>{dayjs(webhook.lastedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                </span>
              }
            />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-url']}>
            <TextLimit text={webhook.url} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-operate']}>
            {visible && (
              <div className={styles['webhook-operation']}>
                <div
                  className={styles['webhook-operation-item']}
                  onClick={() => {
                    handleEdit(webhook.id);
                  }}
                >
                  <FormattedMessage id="common.edit.text" />
                </div>
                <div
                  className={styles['webhook-operation-item']}
                  onClick={() => {
                    setDeleteModalOpen(true);
                  }}
                >
                  <FormattedMessage id="common.delete.text" />
                </div>
              </div>
            )}
          </div>
        </Table.Cell>
      </Table.Row>
      <DeleteTipsModal
        open={deleteModalOpen}
        content={intl.formatMessage({ id: 'webhook.delete.tips.content' })}
        title={intl.formatMessage({ id: 'webhook.delete.tips.title' })}
        onCancel={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={() => {
          handleDelete();
          setDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default WebHookItem;
