import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table } from 'semantic-ui-react';
import dayjs from 'dayjs';
import TextLimit from 'components/TextLimit';
import { ITokenListItem } from 'interfaces/token';
import DeleteTipsModal from 'components/DeleteTipsModal';
import { deleteToken } from 'services/tokens';
import message from 'components/MessageBox';
import styles from './index.module.scss';
interface IProps {
  token: ITokenListItem;
  refresh?: () => unknown;
}

const TokenItem = (props: IProps) => {
  const { token, refresh } = props;
  const [open, setOpen] = useState<boolean>(false);

  const intl = useIntl();

  const onDelete = useCallback(async () => {
    try {
      setOpen(false);
      const res = await deleteToken(token.id);
      if(res.success) {
        refresh && refresh();
        message.success(intl.formatMessage({ id: 'token.delete.success' }));
      } else {
        message.error(intl.formatMessage({ id: 'token.delete.error' }));
      }
    } catch {
      message.error(intl.formatMessage({ id: 'token.delete.error' }));
    }
  }, [intl, token.id, refresh]);

  return (
    <>
      <Table.Row className={styles['list-item']}>
        <Table.Cell>
          <div className={styles['list-item-name']}>
            <TextLimit maxWidth={400} text={token.name} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['list-item-last-time']}><TextLimit text={token.visitedTime ? dayjs(token.visitedTime).format('YYYY-MM-DD HH:mm:ss') : '-'} /></div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['list-item-opt']}>
            <div
              className={styles['token-operation-item']}
              onClick={() => {
                setOpen(true);
              }}
            >
              <FormattedMessage id="common.delete.text" />
            </div>
          </div>
        </Table.Cell>
      </Table.Row>
      <DeleteTipsModal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={onDelete}
        content={intl.formatMessage({ id: 'token.delete.tips.content' })}
        title={intl.formatMessage({ id: 'token.delete.tips.title' })}
      />
    </>
  );
};

export default TokenItem;
