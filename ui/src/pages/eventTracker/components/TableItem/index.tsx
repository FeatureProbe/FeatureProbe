import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { Popup, Table } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import JsonEditor from 'components/JsonEditor';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { IEvent } from 'interfaces/eventTracker';

import styles from './index.module.scss';

interface IProps {
  type: string;
  event: IEvent;
}

const TableItem = (props: IProps) => {
  const { event } = props;
  const [ open, saveOpen ] = useState<boolean>(false);
  const intl = useIntl();

  useEffect(() => {
    const handler = () => {
      if (open) {
        saveOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [open]);

  const getTypeText = useMemo(() => {
    return new Map([
      ['access', intl.formatMessage({id: 'event.tracker.type.access'})],
      ['summary', intl.formatMessage({id: 'event.tracker.type.summary'})],
      ['debug', intl.formatMessage({id: 'event.tracker.type.debug'})],
      ['custom', intl.formatMessage({id: 'analysis.event.custom'})],
      ['pageview', intl.formatMessage({id: 'analysis.event.pageview'})],
      ['click', intl.formatMessage({id: 'analysis.event.click'})],
    ]);
  }, [intl]);

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
        { getTypeText.get(event.kind) }
      </Table.Cell>
      <Table.Cell>
        {
          (event.kind === 'access' ) && (
            <div>
              {
                intl.locale === 'zh-CN' ? (
                  <>
                    <FormattedMessage id='event.tracker.evaluated.user' /> 
                    <span className={styles['toggle-user']}>{event.user}</span>
                    <FormattedMessage id='event.tracker.evaluated.left' /> 
                    {
                      event.key && (
                        <CopyToClipboardPopup text={event.key}>
                          <span className={styles['toggle-key']}>{event.key}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                    <FormattedMessage id='event.tracker.evaluated.middle' />
                    <span className={styles['toggle-value']}>{event.value}</span>
                    <FormattedMessage id='event.tracker.evaluated.right' />
                  </>
                ) : (
                  <>
                    <FormattedMessage id='event.tracker.evaluated.user' /> 
                    <span className={styles['toggle-user']}>{event.user}</span>
                    <FormattedMessage id='event.tracker.evaluated.left' /> 
                    <span className={styles['toggle-value']}>{event.value}</span>
                    <FormattedMessage id='event.tracker.evaluated.middle' /> 
                    {
                      event.key && (
                        <CopyToClipboardPopup text={event.key}>
                          <span className={styles['toggle-key']}>{event.key}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                  </>
                )
              }
            </div>
          )
        }
        {
          (event.kind === 'summary') && (
            <div>
              {
                intl.locale === 'zh-CN' ? (
                  <>
                    <FormattedMessage id='event.tracker.evaluated.left' /> 
                    {
                      event.toggleKey && (
                        <CopyToClipboardPopup text={event.toggleKey}>
                          <span className={styles['toggle-key']}>{event.toggleKey}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                    <FormattedMessage id='event.tracker.evaluated.middle' />
                    <span className={styles['toggle-value']}>{event.value}</span>
                    <FormattedMessage id='event.tracker.evaluated.right' />
                    <span className={styles['toggle-value']}>{event.count}</span>
                    <FormattedMessage id='event.tracker.evaluated.unit' />
                  </>
                ) : (
                  <>
                    <FormattedMessage id='event.tracker.evaluated' /> 
                    <span className={styles['toggle-value']}>{event.value}</span>
                    <FormattedMessage id='event.tracker.evaluated.middle' /> 
                    {
                      event.toggleKey && (
                        <CopyToClipboardPopup text={event.toggleKey}>
                          <span className={styles['toggle-key']}>{event.toggleKey}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                    <span className={styles['toggle-value']}>{event.count}</span>
                    <FormattedMessage id='event.tracker.evaluated.unit' />
                  </>
                )
              }
            </div>
          )
        }
        {
          (event.kind === 'debug') && (
            <div>
              {
                intl.locale === 'zh-CN' ? (
                  <>
                    <FormattedMessage id='event.tracker.evaluated.user' /> 
                    <span className={styles['toggle-user']}>{event.userKey}</span>
                    <FormattedMessage id='event.tracker.evaluated.left' /> 
                    {
                      event.toggleKey && (
                        <CopyToClipboardPopup text={event.toggleKey}>
                          <span className={styles['toggle-key']}>{event.toggleKey}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                    <FormattedMessage id='event.tracker.evaluated.middle' /> 
                    <span className={styles['toggle-value']}>{event.value}</span>
                    <FormattedMessage id='event.tracker.evaluated.right' />
                  </>
                ) : (
                  <>
                    <FormattedMessage id='event.tracker.evaluated.user' /> 
                    <span className={styles['toggle-user']}>{event.userKey}</span>
                    <FormattedMessage id='event.tracker.evaluated.left' /> 
                    <span className={styles['toggle-value']}>{event.value}</span>
                    <FormattedMessage id='event.tracker.evaluated.middle' /> 
                    {
                      event.toggleKey && (
                        <CopyToClipboardPopup text={event.toggleKey}>
                          <span className={styles['toggle-key']}>{event.toggleKey}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                  </>
                )
              }
            </div>
          )
        }
        {
          event.kind === 'pageview' && (
            <div>
              {
                intl.locale === 'zh-CN' ? (
                  <>
                    <FormattedMessage id='event.tracker.tracked' /> 
                    <span className={styles['toggle-user']}>{event.user}</span>
                    <FormattedMessage id='event.tracker.of' />
                    <FormattedMessage id='analysis.event.pageview' />
                  </>
                ) : (
                  <>
                    <FormattedMessage id='event.tracker.tracked' /> 
                    <FormattedMessage id='getstarted.track.pageview' />
                    <FormattedMessage id='event.tracker.tracked.middle' />
                    <span className={styles['toggle-user']}>{event.user}</span>
                  </>
                )
              }
            </div>
          )
        }
        {
          event.kind === 'click' && (
            <div>
              {
                intl.locale === 'zh-CN' ? (
                  <>
                    <FormattedMessage id='event.tracker.tracked' /> 
                    <span className={styles['toggle-user']}>{event.user}</span>
                    <FormattedMessage id='event.tracker.of' />
                    <FormattedMessage id='analysis.event.click' />
                  </>
                ) : (
                  <>
                    <FormattedMessage id='event.tracker.tracked' /> 
                    <FormattedMessage id='getstarted.track.click' />
                    <FormattedMessage id='event.tracker.tracked.middle' />
                    <span className={styles['toggle-user']}>{event.user}</span>
                  </>
                )
              }
              
            </div>
          )
        }
        {
          (event.kind === 'custom') && (
            <div>
              {
                intl.locale === 'zh-CN' ? (
                  <>
                    <FormattedMessage id='event.tracker.tracked' />
                    <span className={styles['toggle-user']}>{event.user}</span>
                    <FormattedMessage id='event.tracker.of' />
                    {
                      event.name && (
                        <CopyToClipboardPopup text={event.name}>
                          <span className={styles['toggle-key']}>{event.name}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                    <FormattedMessage id='event.tracker.tracked.middle' />
                    {
                      (event.value !== null && event.value !== undefined) && (
                        <>
                          <FormattedMessage id='event.tracker.tracked.right' />
                          <span>{event.value}</span>
                        </>
                      )
                    }
                  </>
                ) : (
                  <>
                    <FormattedMessage id='event.tracker.tracked' />
                    {
                      event.name && (
                        <CopyToClipboardPopup text={event.name}>
                          <span className={styles['toggle-key']}>{event.name}</span>
                        </CopyToClipboardPopup>
                      )
                    }
                    <FormattedMessage id='event.tracker.tracked.middle' />
                    <span className={styles['toggle-user']}>{event.user}</span>
                    {
                      (event.value !== null && event.value !== undefined) && (
                        <>
                          <FormattedMessage id='event.tracker.tracked.right' />
                          <span>{event.value}</span>
                        </>
                      )
                    }
                  </>
                )
              }
              
            </div>
          )
        }
      </Table.Cell>
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
                disabled={true}
              />
            </div>
          </div>
        </Popup>
      </Table.Cell>
    </Table.Row>
  );
};

export default TableItem;
