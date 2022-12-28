import { CSSProperties } from 'react';
import styles from './DiffFieldValue.module.scss';

export type DiffChangeType = 'add' | 'remove' | 'modify' | 'same';

export const DiffFieldValue = (props: { type?: DiffChangeType; value?: string | string[]; style?: CSSProperties }) => {
  const { type, style, value } = props;
  const typeCls = styles[`field-value-${type}`];

  if (value instanceof Array) {
    return (
      <div>
        {value.map((item) => {
          return <div style={style} className={`${styles['diff-field-value']} ${typeCls}`}>
            {item}
          </div>;
        })}
      </div>
    );
  }

  return (
    <div style={style} className={`${styles['diff-field-value']} ${typeCls}`}>
      {value}
    </div>
  );
};
