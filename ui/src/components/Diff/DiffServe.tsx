import { FormattedMessage } from 'react-intl';
import { CSSProperties } from 'react';
import { Table } from 'semantic-ui-react';
import { ChangeItem } from './diff';
import { DiffFieldValue } from './DiffFieldValue';
import { renderField, renderFieldsItems } from './renderDiff';
import { diffType, positionType } from './constants';
import conditionStyles from './RulesDiffContent.module.scss';
import fieldStyles from './fields.module.scss';
import styles from './DiffServe.module.scss';

interface DiffServeContentProps {
  map?: Map<string, string>;
  content:
    | {
        split?: number[];
        select?: string;
      }
    | ChangeItem[];
  type: positionType;
  diffType: diffType;
  rowStyle?: CSSProperties;
}

export const DiffServeContent: React.FC<DiffServeContentProps> = (props) => {
  const { content, type, diffType } = props;

  const render = () => {
    if (content instanceof Array) {
      return renderField(content, type, (value) => {
        if (value.get('select')) {
          const select = value.get('select');
          if (select?.type === 'add' && type === 'after') {
            return <DiffFieldValue type="add" value={select.value as string} />;
          } else if (select?.type === 'remove' && type === 'before') {
            return <DiffFieldValue type="remove" value={select.value as string} />;
          } else if (select?.type === 'same') {
            return <DiffFieldValue type="same" value={select.value as string} />;
          }
        }
        if (value.get('split')) {
          const split = value.get('split');
          if (split && split.value instanceof Array && typeof split.value[0] !== 'object') {
            return <DiffFieldValue type={split.type} value={split.value} />;
          } else {
            return renderFieldsItems(split?.value as ChangeItem[], type, (value, diffType, _, index) => {
              if (diffType === 'add' && type === 'after') {
                return <DiffFieldValue type="add" value={value as string} key={index} />;
              } else if (diffType === 'remove' && type === 'before') {
                return <DiffFieldValue type="remove" value={value as string} key={index} />;
              } else if (diffType === 'same') {
                return (
                  <DiffFieldValue
                    style={{
                      background: 'rgba(33,37,41,0.08)',
                    }}
                    type="same"
                    value={value as string}
                    key={index}
                  />
                );
              }
            });
          }
        }
      });
    } else {
      if (content.select !== undefined) {
        return <DiffFieldValue value={content.select} />;
      }
      if (content.split !== undefined) {
        return <DiffFieldValue value={content.split as unknown as string[]} />;
      }
    }
  };

  return (
    <Table.Row className={`${fieldStyles[`diff-item-${diffType}`]} ${conditionStyles['condition-diff-item']}`}>
      <Table.Cell>
        <FormattedMessage id="common.serve.text" />
      </Table.Cell>
      <Table.Cell colSpan="5">{render()}</Table.Cell>
    </Table.Row>
  );
};

interface DiffServeProps {
  content:
    | {
        split?: number[];
        select?: string;
      }
    | ChangeItem[];
}

export const DiffServe: React.FC<DiffServeProps> = (props) => {
  const { content } = props;

  return (
    <div className={styles['serve-diff']}>
      <div>
        <Table>
          <Table.Body>
            <DiffServeContent diffType="modify" content={content} type={'before'} />
          </Table.Body>
        </Table>
      </div>
      <div>
        <Table>
          <Table.Body>
            <DiffServeContent diffType="modify" content={content} type={'after'} />
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
