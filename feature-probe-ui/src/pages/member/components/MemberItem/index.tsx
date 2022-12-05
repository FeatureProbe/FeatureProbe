import { useState, useCallback, SyntheticEvent } from 'react';
import dayjs from 'dayjs';
import { Table } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { IMember, IUser } from 'interfaces/member';
import { deleteMember } from 'services/member';
import message from 'components/MessageBox';
import { OWNER } from 'constants/auth';
import { HeaderContainer } from 'layout/hooks';
import styles from './index.module.scss';

interface IProps {
  member?: IMember;
  setDrawerVisible(visible: boolean): void;
  setIsAdd(isAdd: boolean): void;
  setEditUser(member?: IUser): void;
  refreshMemberList(pageIndex: number): void;
}

const MemberItem = (props: IProps) => {
  const { member, setDrawerVisible, setIsAdd, setEditUser, refreshMemberList } = props;
  const [ open, setOpen ] = useState<boolean>(false);
  const intl = useIntl();

  const { userInfo } = HeaderContainer.useContainer();

  const handleEdit = useCallback(() => {
    setDrawerVisible(true);
    setIsAdd(false);
    setEditUser(member);
  }, [member, setDrawerVisible, setIsAdd, setEditUser]);

  const handleDelete = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen(true);
  }, []);

  const handleCancel = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(async (e: SyntheticEvent, account: string) => {
    e.stopPropagation();
    setOpen(false);

    const res = await deleteMember({
      account: account,
    });

    if (res.success) {
      message.success(intl.formatMessage({id: 'members.delete.success.text'}));
      refreshMemberList(0);
    } else {
      message.error(intl.formatMessage({id: 'members.delete.error.text'}));
    }
  }, [intl, refreshMemberList]);

	return (
    <Table.Row className={styles['list-item']}>
      <Table.Cell>
        <div className={styles['member-name']}>
          {member?.account}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['member-role']}>
          {'' + member?.role.slice(0, 1) + member?.role.slice(1).toLocaleLowerCase()}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['member-created-by']}>
          {member?.createdBy}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['member-last-seen']}>
          <div className={styles['toggle-modified-time']}>
            {member?.visitedTime ? dayjs(member.visitedTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        {
          OWNER.includes(userInfo?.role) && member?.allowEdit ? (
            <div className={styles['member-operation']}>
              <div className={styles['member-operation-item']} onClick={() => handleEdit()}>
                <FormattedMessage id='common.edit.text' />
              </div>
              <div className={styles['member-operation-item']} onClick={(e: SyntheticEvent) => handleDelete(e)}>
                <FormattedMessage id='common.delete.text' />
              </div>
            </div>
          ) : (
            <div className={styles['member-operation']}></div>
          )
        }
      </Table.Cell>

      <Modal 
        open={open}
        width={400}
        handleCancel={(e: SyntheticEvent) => handleCancel(e)}
        handleConfirm={(e: SyntheticEvent) => handleConfirm(e, member?.account || '')}
      >
        <div>
          <div className={styles['modal-header']}>
            <Icon customclass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='members.delete.modal.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='members.delete.modal.content' />
          </div>
        </div>
      </Modal>
    </Table.Row>
	);
};

export default MemberItem;