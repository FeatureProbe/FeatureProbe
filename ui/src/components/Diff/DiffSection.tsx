import { cloneDeep } from 'lodash';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import idiff, { ChangeItem } from './diff';
import styles from './DiffSection.module.scss';

export interface DiffSectionProps {
  title: string;
  before?: unknown;
  after?: unknown;
  diffKey: string;
  renderContent: (diffContent: ChangeItem[]) => ReactNode;
  beforeDiff?: (before: unknown, after: unknown) => unknown[];
  setCount?: (key: string, count: number) => void;
}

const DiffSection: React.FC<DiffSectionProps> = (props) => {
  const { title, before, after, renderContent, beforeDiff, setCount, diffKey } = props;
  const [hide, setHide] = useState(false);

  const diffContent = useMemo(() => {
    let left, right;
    if (beforeDiff) {
      [left, right] = beforeDiff(cloneDeep(before), cloneDeep(after));
    } else {
      [left, right] = [before, after];
    }

    const diffContent = before && after ? idiff(left, right) : undefined;

    return diffContent;
  }, [beforeDiff, before, after]);

  useEffect(() => {
    let modifyCount = 0;
    diffContent?.forEach((item) => {
      if (item.type !== 'same') {
        if (diffKey === 'status' || diffKey === 'default' || diffKey === 'disabled' || diffKey === 'prerequisites') {
          modifyCount = 1;
        } else {
          modifyCount++;
        }
      }
    });

    setHide(modifyCount === 0);
    setCount && setCount(diffKey, modifyCount);
  }, [diffContent, diffKey, setCount]);

  return (
    <div hidden={hide} className={styles['diff-section']}>
      <div className={styles['head-line']}>
        <div className={styles['before']}>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles['after']}>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
      <div className={styles.content}>{diffContent && renderContent(diffContent)}</div>
    </div>
  );
};

export default DiffSection;
