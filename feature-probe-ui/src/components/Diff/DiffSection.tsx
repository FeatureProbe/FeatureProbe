import { ArrayChange } from 'diff';
import { cloneDeep } from 'lodash';
import { ReactNode, useMemo } from 'react';
import idiff, { DiffParam, DiffResult } from './diff';
import styles from './DiffSection.module.scss';

export interface DiffSectionProps {
  title: string;
  before?: unknown;
  after?: unknown;
  diffKey: string;
  renderContent: (diffContent: DiffResult) => ReactNode;
  beforeDiff?: (before: unknown, after: unknown) => unknown[];
  setCount?: (key: string, count: number) => void;
}

const DiffSection: React.FC<DiffSectionProps> = (props) => {
  const { title, before, after, renderContent, beforeDiff, setCount, diffKey } = props;

  const diffContent = useMemo(() => {
    let left, right;
    if (beforeDiff) {
      [left, right] = beforeDiff(cloneDeep(before), cloneDeep(after));
    } else {
      [left, right] = [before, after];
    }

    const diffContent = before && after ? idiff(left as DiffParam, right as DiffParam) : undefined;

    return diffContent;
  }, [before, after, beforeDiff]);

  let hide = false;
  if (!diffContent || (diffContent.length === 1 && !diffContent[0].removed && !diffContent[0].modified && !diffContent[0].added)) {
    hide = true;
  }
  if(diffContent && diffContent.length === 1 && diffContent[0].modified) {
    let count = 0;
    diffContent[0].value.forEach((item) => {
      if((item as ArrayChange<unknown>).value && (item as ArrayChange<unknown>).value.length === 1) {
        count++;
      }
    });
    if(count === diffContent[0].value.length) {
      hide = true;
    }
  }

  let count = 0;
  diffContent?.forEach((item) => {
    if(item.removed || item.added) {
      count += item.value.length;
    } else if(item.modified) {
      count += item.value.reduce<number>((pre, current) => {
        if((current as ArrayChange<unknown>).value && (current as ArrayChange<unknown>).value.length !== 1) {
          return pre + 1;
        } else {
          return pre;
        }
      }, 0);
    }
  });
  setCount && setCount(diffKey, count);

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
