import { SyntheticEvent, useEffect, useState } from 'react';
import { Popup, Table } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import JsonEditor from 'components/JsonEditor';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { IEvent } from 'interfaces/eventTracker';

import styles from './index.module.scss';

interface IProps {
  type: string;
  event: IEvent;
}

const TableItem = (props: IProps) => {
  const { type, event } = props;
  const [ open, saveOpen ] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => {
      if (open) {
        saveOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [open]);

  return (
    <Table.Row className={styles['table-row']}>
      <Table.Cell>
        <div className={styles['event-time']}>
          {
            event.kind === 'summary' 
              ? dayjs(event.startDate).format('YYYY-MM-DD HH:mm:ss') 
              : dayjs(event.time).format('YYYY-MM-DD HH:mm:ss')
          }
        </div>
      </Table.Cell>
      <Table.Cell>
        { event.kind }
      </Table.Cell>
      <Table.Cell>
        {
          (event.kind === 'debug' || event.kind === 'summary') ? (
            <div>
              { event.userKey ?? '-' }
              <span className={styles['event-user-detail']}>
                { event.userDetail && JSON.stringify(JSON.parse(event.userDetail).attrs).replace(/"/g, '').replace(/{/g, '(').replace(/}/g, ')') }
              </span>
            </div>
          ) 
          : (
            <div>
              { event.user ?? '-' }
            </div>
          )
        }
      </Table.Cell>
      {
        type === 'all' && (
          <Table.Cell>
            {
              (event.kind === 'access') && (
                <div>
                  <FormattedMessage id='event.tracker.evaluated' /> 
                  <span className={styles['toggle-key']}>{event.key}</span>
                </div>
              )
            }
            {
              ['debug', 'summary'].includes(event.kind) && (
                <div>
                  <FormattedMessage id='event.tracker.evaluated' /> 
                  <span className={styles['toggle-key']}>{event.toggleKey}</span>
                </div>
              )
            }
            {
              ['pageview', 'click'].includes(event.kind) && (
                <div>
                  <FormattedMessage id='event.tracker.tracked' /> 
                  <span className={styles['toggle-key']}>{event.name}</span>
                </div>
              )
            }
            {
              (event.kind === 'custom') && (
                <div>
                  <FormattedMessage id='event.tracker.tracked' /> 
                  <span className={styles['toggle-key']}>{event.name}</span>
                </div>
              )
            }
          </Table.Cell>
        )
      }
      {
        type === 'toggle' && (
          <>
            <Table.Cell>
              {
                event.kind === 'access' ? (
                  <div>
                    <span>{event.key}</span>
                    {
                      event.key && (
                        <CopyToClipboardPopup text={event.key}>
                          <Icon type='copy' customclass={styles['icon-copy']} />
                        </CopyToClipboardPopup>
                      )
                    }
                  </div>
                ) : (
                  <div>
                    <span>{event.toggleKey}</span>
                    {
                      event.toggleKey && (
                        <CopyToClipboardPopup text={event.toggleKey}>
                          <Icon type='copy' customclass={styles['icon-copy']} />
                        </CopyToClipboardPopup>
                      )
                    }
                  </div>
                )
              }
            </Table.Cell>
            <Table.Cell>
              {event.reason ?? '-'}
            </Table.Cell>
            <Table.Cell>
              {event.value ?? '-'}
            </Table.Cell>
          </>
        )
      }
      {
        type === 'metric' && (
          <>
            <Table.Cell>
              {event.name}
            </Table.Cell>
            <Table.Cell>
              {event.value ?? '-'}
            </Table.Cell>
          </>
        )
      }
      <Table.Cell>
        <Popup
          open={open}
          position='bottom right'
          className={styles.popup}
          trigger={
            <span
              className={styles['view-attributes']}
              onClick={(e: SyntheticEvent) => {
                document.body.click();
                e.stopPropagation();
                saveOpen(true);
              }}
            >
              <FormattedMessage id='event.tracker.view.attributes' />
            </span>
          }
          onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.modal}>
            <div className={styles['modal-header']}>
              <FormattedMessage id='event.tracker.attributes' />
            </div>
            {
              event.sdkType && (
                <div className={styles['modal-description']}>
                  <FormattedMessage id='event.tracker.source' /> 
                  {event.sdkType}
                </div>
              )
            }
            <div className={styles['modal-content']}>
              <JsonEditor 
                value={JSON.stringify(event, null, 2)}
              />
            </div>
          </div>
        </Popup>
      </Table.Cell>
    </Table.Row>
  );
};

export default TableItem;
