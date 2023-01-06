import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { useCallback, useRef, useState } from 'react';
import DiffSection, { DiffSectionProps } from './DiffSection';
import styles from './index.module.scss';

interface DiffProps {
  sections: DiffSectionProps[];
  height?: number;
  maxHeight?: number;
  defaultOpen?: boolean;
}

const Diff: React.FC<DiffProps> = (props) => {
  const { sections, defaultOpen } = props;
  const CountMapRef = useRef<Map<string, number>>(new Map());
  const [count, saveCount] = useState(0);
  const [show, setShow] = useState(defaultOpen || false);

  const setCount = useCallback((key: string, count: number) => {
    CountMapRef.current.set(key, count);
    let temp = 0;
    CountMapRef.current.forEach((value) => {
      temp += value;
    });
    saveCount(temp);
  }, []);

  return (
    <div className={styles.box}>
      <div
        className={styles.tips}
        onClick={() => {
          setShow((show) => {
            return !show;
          });
        }}
      >
        <div>
          <Icon type="warning-circle" customclass={styles['warning-circle']} />
          <FormattedMessage id="common.diff.tips" />
          <span><FormattedMessage id="diff.count.text" values={{count: count}} /></span>
        </div>
        <div>
          <div>
            <div className={styles['old-square']}></div>
            <FormattedMessage id="diff.old.text" />
          </div>
          <div>
            <div className={styles['new-square']}></div>
            <FormattedMessage id="diff.create.text" />
          </div>
          <div>
            {show ? (
              <Icon customclass={styles['icon-accordion']} type="angle-up" />
            ) : (
              <Icon customclass={styles['icon-accordion']} type="angle-down" />
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          display: !show ? 'none' : 'block',
        }}
        className={styles['diff']}
      >
        {sections.map((props) => {
          return <DiffSection key={props.diffKey} setCount={setCount} {...props} />;
        })}
      </div>
    </div>
  );
};

export default Diff;
