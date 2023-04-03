import { SyntheticEvent } from 'react';
import { Table, PaginationProps } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import TextLimit from 'components/TextLimit';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import CustomPagination from 'components/Pagination';
import { IPrerequisiteToggle } from 'interfaces/prerequisite';

import styles from './index.module.scss';

interface IPagination {
  pageIndex: number;
  totalPages: number;
}

interface IProps {
  total: number;
  pagination: IPagination;
  toggleList: IPrerequisiteToggle[];
  handlePageChange(e: SyntheticEvent, data: PaginationProps): void;
}

const ToggleList = (props: IProps) => {
  const { toggleList, total, pagination, handlePageChange } = props;

  return (
    <div>
      <Table basic="very" unstackable className={styles['table']}>
        <Table.Header className={styles['table-header']}>
          <Table.Row>
            <Table.HeaderCell className={styles['column-toggle']}>
              <FormattedMessage id="common.toggle.text" />
            </Table.HeaderCell>
            <Table.HeaderCell className={styles['column-status']}>
              <FormattedMessage id="toggles.table.status" />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className={styles['table-body']}>
          {
            toggleList?.map((toggle: IPrerequisiteToggle) => {
              const listItem = classNames(styles['list-item'], {
                [styles['list-item-enabled']]: !toggle.disabled,
              });

              return (
                <Table.Row key={toggle.key} className={listItem}>
                  <Table.Cell>
                    <div className={styles['toggle-info']}>
                      <div className={styles['toggle-info-name']}>
                        <TextLimit text={toggle.name} maxWidth={150} />
                      </div>
                      <div className={styles['toggle-info-key']}>
                        <CopyToClipboardPopup text={toggle.key}>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className={styles['toggle-info-key-label']}
                          >
                            {toggle.key}
                          </div>
                        </CopyToClipboardPopup>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {toggle?.disabled ? (
                      <div className={styles['toggle-status']}>
                        <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-disabled']}`}></div>
                        <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-disabled']}`}>
                          <FormattedMessage id="common.disabled.text" />
                        </div>
                      </div>
                    ) : (
                      <div className={styles['toggle-status']}>
                        <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-enabled']}`}></div>
                        <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-enabled']}`}>
                          <FormattedMessage id="common.enabled.text" />
                        </div>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })
          }
        </Table.Body>
      </Table>
      {
        toggleList.length !== 0 ? (
          <CustomPagination
            total={total}
            pagination={pagination}
            hideTotal={true}
            handlePageChange={handlePageChange}
          />
        ) : (
          <div className={styles['no-data']}>
            <div>
              <img className={styles['no-data-image']} src={require('images/no-data.png')} alt='no-data' />
            </div>
            <div>
              <FormattedMessage id='common.nodata.text' />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ToggleList;
