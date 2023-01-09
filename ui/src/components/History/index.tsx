import { SyntheticEvent } from 'react';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextLimit from 'components/TextLimit';
import Loading from 'components/Loading';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { IVersion } from 'interfaces/targeting';
import styles from './index.module.scss';

interface IProps {
  versions: IVersion[];
  hasMore: boolean;
  latestVersion: number;
  selectedVersion: number;
  isHistoryLoading: boolean;
  loadMore(): void;
  reviewHistory(version: IVersion): void;
}

const History = (props: IProps) => {
  const { versions, hasMore, selectedVersion, latestVersion, isHistoryLoading, loadMore, reviewHistory } = props;

  return (
    <div className={styles.history}>
      <div className={styles['history-title']}>
        <span>
          <FormattedMessage id='common.history.text' />
        </span>
      </div>
      <div className={styles.lists} id='scrollableDiv'>
        {
          isHistoryLoading ? <Loading /> : (
            <InfiniteScroll
              dataLength={versions.length}
              next={loadMore}
              hasMore={hasMore}
              scrollableTarget='scrollableDiv'
              loader={
                <div className={styles.loading}>
                  <FormattedMessage id='common.loading.text' />
                </div>
              }
            >
              {
                versions.length > 0 && versions.map((item) => {
                  const clsRight = classNames(
                    styles['version-right'],
                    {
                      [styles['version-right-selected']]: item?.version === Number(selectedVersion)
                    }
                  );

                  const clsCircle = classNames(
                    styles.circle,
                    {
                      [styles['circle-selected']]: item?.version === Number(selectedVersion)
                    }
                  );

                  const clsVersion = classNames(
                    {
                      [styles['version-selected']]: item?.version === Number(selectedVersion)
                    }
                  );

                  const clsVersionText = classNames(
                    styles['version-text'],
                    {
                      [styles['version-text-selected']]: item?.version === Number(selectedVersion)
                    }
                  );

                  return (
                    <div 
                      key={item.version} 
                      className={styles.version} 
                      onClick={(e: SyntheticEvent) => {
                        e.stopPropagation();
                        if (item?.version === Number(selectedVersion)) {
                          return;
                        }
                        reviewHistory(item);
                      }}
                    >
                      <div className={styles['version-left']}>
                        <div className={clsCircle}></div>
                      </div>
                      <div className={clsRight}>
                        <div className={styles.title}>
                          <span className={clsVersion}>
                            <FormattedMessage id='common.version.uppercase.text' />:
                          </span>
                          <span className={clsVersionText}>
                            { item.version }
                          </span>
                          {
                            item.version === latestVersion && (
                              <span className={styles.current}>
                                (<FormattedMessage id='common.current.version.text' />)
                              </span>
                            )
                          }
                        </div>
                        <div className={styles.modifyBy}>
                          <span className={styles['version-title']}>
                            { item.approvalStatus === 'JUMP' ? <FormattedMessage id='approvals.skipped.by' /> : <FormattedMessage id='approvals.published.by' /> }
                          </span>
                          :
                          <Popup
                            inverted
                            className={styles.popup}
                            trigger={
                              <span>{ item.createdBy }</span>
                            }
                            content={
                              <span>
                                { item.createdBy }
                                <span className={styles['version-popup']}>{ dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss') }</span>
                              </span>
                            }
                            position='top center'
                          />
                        </div>
                        {
                          item.approvalStatus === 'PASS' && typeof item.approvalTime === 'string' && (
                            <div className={styles.modifyBy}>
                              <span className={styles['version-title']}>
                                <FormattedMessage id='approvals.reviewed.by' />
                              </span>
                              :
                              <Popup
                                inverted
                                className={styles.popup}
                                trigger={
                                  <span>{ item.approvalBy }</span>
                                }
                                content={
                                  <span>
                                    { item.approvalBy }
                                    <span className={styles['version-popup']}>{ dayjs(item.approvalTime).format('YYYY-MM-DD HH:mm:ss') }</span>
                                  </span>
                                }
                                position='top center'
                              />
                            </div>
                          )
                        }
                        {
                          item.approvalStatus === 'JUMP' && (
                            <div className={styles.comment}>
                              <span className={styles['version-title']}>
                                <FormattedMessage id='approvals.table.header.comment' />
                              </span>
                              :
                              <Popup
                                inverted
                                style={{opacity: '0.8'}}
                                className={styles.popup}
                                trigger={
                                  <span className={styles['tooltip-text']}>{ item.approvalComment }</span>
                                }
                                content={
                                  <div className={styles.tooltip}>
                                    {item.approvalComment}
                                  </div>
                                }
                                position='top left'
                              />
                            </div>
                          )
                        }
                        {
                          item.comment && <div className={styles.comment}>
                            <span className={styles['version-title']}>
                              <FormattedMessage id='targeting.publish.modal.comment' />
                            </span>
                            :
                            <span className={styles['tooltip-text']}><TextLimit text={ item.comment } /></span>
                          </div>
                        }
                      </div>
                    </div>
                  );
                })
              }
              {
                hasMore && versions.length !== 0 && (
                  <div className={styles.hasMore} onClick={loadMore}>
                    <FormattedMessage id='targeting.view.more' />
                  </div>
                )
              }
              {
                versions.length === 0 && (
                  <div className={styles['no-data']}>
                    <img className={styles['no-data-image']} src={require('images/no-data.png')} alt='no-data' />
                    <FormattedMessage id='common.nodata.text' />
                  </div>
                )
              }
            </InfiniteScroll>
          )
        }
      </div>
    </div>
  );
};

export default History;