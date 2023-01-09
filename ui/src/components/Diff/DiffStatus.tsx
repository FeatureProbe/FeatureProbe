import { useIntl } from 'react-intl';
import { DiffResult } from './diff';
import { DiffFieldValue } from './DiffFieldValue';
import { renderField } from './renderDiff';
import styles from './DiffStatus.module.scss';

interface DiffStatusContentProps {
  content: DiffResult;
}

export const DiffStatusContent: React.FC<DiffStatusContentProps> = (props) => {
  const { content } = props;
  const intl = useIntl();

  return (
    <div className={styles['diff-status-content']}>
      <div className={styles['diff-status-item']}>
        <div className={styles['diff-status-field']}>
          {renderField(content, 'before', (map) => {
            const disabled = map.get('disabled');
            if (disabled?.type === 'remove') {
              return (
                <DiffFieldValue
                  type="remove"
                  value={
                    (disabled.value as boolean)
                      ? intl.formatMessage({ id: 'common.disabled.text' })
                      : intl.formatMessage({ id: 'common.enabled.text' })
                  }
                />
              );
            }
          })}
        </div>
      </div>
      <div className={styles['diff-status-item']}>
        <div className={styles['diff-status-field']}>
          {renderField(content, 'after', (map) => {
            const disabled = map.get('disabled');
            if (disabled?.type === 'add') {
              return (
                <DiffFieldValue
                  type="add"
                  value={
                    (disabled.value as boolean)
                      ? intl.formatMessage({ id: 'common.disabled.text' })
                      : intl.formatMessage({ id: 'common.enabled.text' })
                  }
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
