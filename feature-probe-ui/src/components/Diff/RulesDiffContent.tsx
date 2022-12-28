import { ArrayChange } from 'diff';
import { Table } from 'semantic-ui-react';
import { ICondition, IRule } from '../../interfaces/targeting';
import { DiffResult } from './diff';
import { DiffChangeType, DiffFieldValue } from './DiffFieldValue';
import { renderField, renderFieldsItems } from './renderDiff';
import { DiffServeContent } from './DiffServe';
import { ReactNode } from 'react';
import fieldStyles from './fields.module.scss';
import styles from './RulesDiffContent.module.scss';

interface FieldValue {
  type: DiffChangeType;
  value: unknown;
}

interface RowFieldsProps {
  values: FieldValue[];
  modified?: boolean;
  type: 'after' | 'before';
  first?: boolean;
  empty?: boolean;
}

type StringField = {
  [key: string]: unknown;
};

export const RowFields: React.FC<RowFieldsProps> = (props) => {
  const { values, type, first, empty } = props;

  return (
    <>
      <Table.Cell>{!empty && (first ? 'if' : 'and')}</Table.Cell>
      {values.map((item) => {
        return (
          <Table.Cell>
            {item.value instanceof Array && typeof item.value[0] === 'object' ? (
              renderFieldsItems(item.value, type, (value, diffType, type) => {
                if (
                  (diffType === 'add' && type === 'after') ||
                  (diffType === 'remove' && type === 'before') ||
                  diffType === 'same'
                ) {
                  return (
                    <DiffFieldValue
                      style={{
                        background: diffType === 'same' ? 'rgba(33,37,41,0.08)' : 'unset',
                      }}
                      type={diffType}
                      value={value as string}
                    />
                  );
                } else {
                  return <></>;
                }
              })
            ) : (
              <DiffFieldValue
                style={{
                  background: item.type === 'same' && item.value instanceof Array ? 'rgba(33,37,41,0.08)' : 'unset',
                }}
                type={item.type}
                value={item.value as string}
              />
            )}
          </Table.Cell>
        );
      })}
      {values.length >= 5
        ? null
        : (() => {
            const count = 5 - values.length;
            const res = [];
            for (let i = 0; i < count; i++) {
              res.push(<Table.Cell></Table.Cell>);
            }
            return res;
          })()}
    </>
  );
};

interface RuleNameDiffProps {
  diffType: 'remove' | 'add' | 'same';
  type: 'after' | 'before';
  value: string;
}

const RuleNameDiff: React.FC<RuleNameDiffProps> = (props) => {
  const { diffType, type, value } = props;

  if ((diffType === 'add' && type === 'after') || (diffType === 'remove' && type === 'before') || diffType === 'same') {
    return <DiffFieldValue value={value} type={diffType} />;
  }

  return null;
};

interface ConditiondiffRemoveItemProps {
  value: ICondition & { [key: string]: unknown };
  type: 'after' | 'before';
  first?: boolean;
}

const ConditiondiffRemoveItem: React.FC<ConditiondiffRemoveItemProps> = (props) => {
  const { value, type, first } = props;

  const keys = ['type', 'subject', 'predicate', 'objects', 'timezone', 'datetime'];

  return (
    <Table.Row className={`${fieldStyles['diff-item-remove']} ${styles['condition-diff-item']}`}>
      <RowFields
        values={keys.reduce<FieldValue[]>((pre, current) => {
          if (value[current] !== undefined) {
            return [
              ...pre,
              {
                type: 'remove',
                value: value[current],
              },
            ];
          } else {
            return pre;
          }
        }, [])}
        type={type}
        first={first}
      />
    </Table.Row>
  );
};

const ConditiondiffAddItem: React.FC<ConditiondiffRemoveItemProps> = (props) => {
  const { value, first } = props;

  const keys = ['type', 'subject', 'predicate', 'objects', 'timezone', 'datetime'];

  return (
    <Table.Row className={`${fieldStyles['diff-item-add']} ${styles['condition-diff-item']}`}>
      <RowFields
        values={keys.reduce<FieldValue[]>((pre, current) => {
          if (value[current] !== undefined) {
            return [
              ...pre,
              {
                type: 'add',
                value: value[current],
              },
            ];
          } else {
            return pre;
          }
        }, [])}
        type={'after'}
        first={first}
      />
    </Table.Row>
  );
};

interface ConditiondiffSameItemProps {
  value: ICondition & { [key: string]: unknown };
  first?: boolean;
}

const ConditiondiffSameItem: React.FC<ConditiondiffSameItemProps> = (props) => {
  const { value, first } = props;

  const keys = ['type', 'subject', 'predicate', 'objects', 'timezone', 'datetime'];

  return (
    <Table.Row className={`${fieldStyles['diff-item-normal']} ${styles['condition-diff-item']}`}>
      <RowFields
        values={keys.reduce<FieldValue[]>((pre, current) => {
          if (value[current] !== undefined) {
            return [
              ...pre,
              {
                type: 'same',
                value: value[current],
              },
            ];
          } else {
            return pre;
          }
        }, [])}
        type={'after'}
        first={first}
      />
    </Table.Row>
  );
};

const ConditiondiffEmptyItem: React.FC<ConditiondiffSameItemProps> = (props) => {
  const { value, first } = props;

  const keys = ['type', 'subject', 'predicate', 'objects', 'timezone', 'datetime'];

  return (
    <Table.Row className={`${fieldStyles['diff-item-normal']} ${styles['condition-diff-item']}`}>
      <RowFields
        empty
        values={keys.reduce<FieldValue[]>((pre, current) => {
          if (value[current] !== undefined) {
            return [
              ...pre,
              {
                type: 'same',
                value: '',
              },
            ];
          } else {
            return pre;
          }
        }, [])}
        type={'after'}
        first={first}
      />
    </Table.Row>
  );
};

interface ConditiondiffModifyItemProps {
  value: ArrayChange<DiffResult>;
  type: 'after' | 'before';
  first?: boolean;
}

const ConditiondiffModifyItem: React.FC<ConditiondiffModifyItemProps> = (props) => {
  const { value, type, first } = props;

  const keys = ['type', 'subject', 'predicate', 'objects', 'timezone', 'datetime'];

  return (
    <Table.Row className={`${fieldStyles['diff-item-normal']} ${styles['condition-diff-item']}`}>
      {renderField((value as ArrayChange<unknown>).value as DiffResult, type, (map) => {
        return (
          <RowFields
            values={keys.reduce<FieldValue[]>((pre, current) => {
              if (map.get(current) !== undefined) {
                return [...pre, map.get(current) as FieldValue];
              } else {
                return pre;
              }
            }, [])}
            type={type}
            modified
            first={first}
          />
        );
      })}
    </Table.Row>
  );
};

interface ConditionContentProps {
  diffContent: DiffResult;
  type: 'after' | 'before';
  serve?: unknown;
  title?: ReactNode;
}

const ConditionModifyContent: React.FC<ConditionContentProps> = (props) => {
  const { diffContent, type, serve, title } = props;

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={fieldStyles['table-header']}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {diffContent &&
            renderFieldsItems<ICondition>(diffContent, type, (value, diffType, type, index) => {
              if (diffType === 'remove' && type === 'before') {
                return (
                  <ConditiondiffRemoveItem type={type} value={value as ICondition & StringField} first={index === 1} />
                );
              } else if (diffType === 'add' && type === 'after') {
                return (
                  <ConditiondiffAddItem type={type} value={value as ICondition & StringField} first={index === 1} />
                );
              } else if (diffType === 'modify') {
                return (
                  <ConditiondiffModifyItem type={type} value={value as ArrayChange<DiffResult>} first={index === 1} />
                );
              } else if (diffType === 'same') {
                return <ConditiondiffSameItem value={value as ICondition & StringField} first={index === 0} />;
              } else {
                return <ConditiondiffEmptyItem value={value as ICondition & StringField} first={index === 0} />;
              }
            })}
          {serve && <DiffServeContent diffType="modify" content={serve} type={type} />}
        </Table.Body>
      </Table>
    </div>
  );
};

interface ConditionRemoveContentProps {
  content: ICondition[];
  serve: unknown;
  title?: ReactNode;
}

const ConditionRemoveContent: React.FC<ConditionRemoveContentProps> = (props) => {
  const { content, serve, title } = props;

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']} ${fieldStyles['diff-item-remove']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content &&
            content.map((item) => {
              return <ConditiondiffRemoveItem value={item as ICondition & StringField} type="before" />;
            })}
          {serve && <DiffServeContent diffType="remove" content={serve} type="before" />}
        </Table.Body>
      </Table>
    </div>
  );
};

const ConditionAddContent: React.FC<ConditionRemoveContentProps> = (props) => {
  const { content, serve, title } = props;

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']} ${fieldStyles['diff-item-add']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content &&
            content.map((item) => {
              return <ConditiondiffAddItem value={item as ICondition & StringField} type="after" />;
            })}
          {serve && <DiffServeContent diffType="add" content={serve} type="after" />}
        </Table.Body>
      </Table>
    </div>
  );
};

interface ConditionSameContentProps extends ConditionRemoveContentProps {
  type: 'after' | 'before';
}

const ConditionSameContent: React.FC<ConditionSameContentProps> = (props) => {
  const { content, serve, type, title } = props;

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content &&
            content.map((item) => {
              return <ConditiondiffSameItem value={item as ICondition & StringField} />;
            })}
          {serve && <DiffServeContent diffType="same" type={type} content={serve} />}
        </Table.Body>
      </Table>
    </div>
  );
};

const ConditionEmptyContent: React.FC<ConditionSameContentProps> = (props) => {
  const { content, serve, type } = props;

  return (
    <div className={styles['empty']}>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content &&
            content.map((item) => {
              return <ConditiondiffEmptyItem value={item as ICondition & StringField} />;
            })}
          {serve && <DiffServeContent diffType="same" type={type} content={serve} />}
        </Table.Body>
      </Table>
    </div>
  );
};

interface RulesDiffContentProps {
  content: DiffResult;
}

export const RulesDiffContent: React.FC<RulesDiffContentProps> = (props) => {
  const { content } = props;

  return (
    <div className={styles['rule-content']}>
      <div>
        {renderFieldsItems<IRule>(content, 'before', (value, type) => {
          if (type === 'remove') {
            return (
              <ConditionRemoveContent
                title={(value as IRule).name}
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
              />
            );
          } else if (type === 'modify') {
            return renderField((value as ArrayChange<unknown>).value as DiffResult, 'before', (map) => {
              const conditions = map.get('conditions');
              const serve = map.get('serve');
              const name = map.get('name');
              if (conditions && conditions.type === 'modify') {
                return (
                  <ConditionModifyContent
                    serve={serve?.value}
                    diffContent={conditions.value as DiffResult}
                    type="before"
                    title={
                      <RuleNameDiff
                        value={name?.value as string}
                        type="before"
                        diffType={name?.type === 'modify' || name?.type === undefined ? 'same' : name.type}
                      />
                    }
                  />
                );
              } else if (conditions && conditions.type === 'same') {
                return (
                  <ConditionSameContent
                    title={
                      <RuleNameDiff
                        value={name?.value as string}
                        type="before"
                        diffType={name?.type === 'modify' || name?.type === undefined ? 'same' : name.type}
                      />
                    }
                    type="before"
                    serve={serve?.value}
                    content={conditions.value as ICondition[]}
                  />
                );
              }
            });
          } else if (type === 'add') {
            return (
              <ConditionEmptyContent
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
                type={'before'}
              />
            );
          }
        })}
      </div>
      <div>
        {renderFieldsItems<IRule>(content, 'after', (value, type) => {
          if (type === 'add') {
            return (
              <ConditionAddContent
                title={(value as IRule).name}
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
              />
            );
          } else if (type === 'modify') {
            return renderField((value as ArrayChange<unknown>).value as DiffResult, 'after', (map) => {
              const conditions = map.get('conditions');
              const serve = map.get('serve');
              const name = map.get('name');
              if (conditions && conditions.type === 'modify') {
                return (
                  <ConditionModifyContent
                    serve={serve?.value}
                    diffContent={conditions.value as DiffResult}
                    type="after"
                    title={
                      <RuleNameDiff
                        value={name?.value as string}
                        type="after"
                        diffType={name?.type === 'modify' || name?.type === undefined ? 'same' : name.type}
                      />
                    }
                  />
                );
              } else if (conditions && conditions.type === 'same') {
                return (
                  <ConditionSameContent
                    title={
                      <RuleNameDiff
                        value={name?.value as string}
                        type="after"
                        diffType={name?.type === 'modify' || name?.type === undefined ? 'same' : name.type}
                      />
                    }
                    type="after"
                    serve={serve?.value}
                    content={conditions.value as ICondition[]}
                  />
                );
              }
            });
          } else if (type === 'remove') {
            return (
              <ConditionEmptyContent
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
                type={'before'}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
