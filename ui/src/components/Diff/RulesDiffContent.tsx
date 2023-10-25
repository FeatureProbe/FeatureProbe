import { ReactNode } from 'react';
import { Table } from 'semantic-ui-react';
import { IntlShape } from 'react-intl';
import { ICondition, IRule } from '../../interfaces/targeting';
import { ChangeItem, DiffResult } from './diff';
import { DiffFieldValue } from './DiffFieldValue';
import { renderField, renderFieldsItems } from './renderDiff';
import { DiffServeContent } from './DiffServe';
import { diffType, positionType, rulesI18NMap } from './constants';
import fieldStyles from './fields.module.scss';
import styles from './RulesDiffContent.module.scss';

export function I18NRules(rules: IRule[], intl: IntlShape) {
  rules.forEach((rule) => {
    rule.conditions.forEach((condition) => {
      const typeI18N = rulesI18NMap.get(condition.type);
      const predicateI18N = rulesI18NMap.get(condition.predicate);
      if (condition.type === 'segment') {
        condition.subject = intl.formatMessage({ id: 'common.user.text' });
      }
      condition.type = typeI18N ? intl.formatMessage({ id: rulesI18NMap.get(condition.type) }) : condition.type;
      condition.predicate = predicateI18N
        ? intl.formatMessage({ id: rulesI18NMap.get(condition.predicate) })
        : condition.predicate;
    });
  });
  return rules;
}

interface FieldValue {
  type: diffType;
  value: unknown;
}

interface RowFieldsProps {
  values: FieldValue[];
  modified?: boolean;
  type: 'after' | 'before';
  first?: boolean;
  empty?: boolean;
}

// type StringField = {
//   [key: string]: unknown;
// };

const KEYS = ['type', 'subject', 'predicate', 'leftPredicate', 'objects', 'timezone', 'datetime', 'rightPredicate', 'rightObjects'];

export const displayMap = new Map([
  ['>=', '['],
  ['>', '('],
  ['<', ')'],
  ['<=', ']'],
]);

	// @ts-ignore value type
const makeBetween = (value) => {
  if (value['leftPredicate']) {
    value.objects = [(
      '' + 
      displayMap.get(value['leftPredicate'] as string) + 
      value['objects'] + 
      ', ' + 
      value['rightObjects'] + 
      displayMap.get(value['rightPredicate'] as string)
    )];
    delete value['leftPredicate'];
    delete value['rightPredicate'];
    delete value['rightObjects'];
  }
  return value;
};

export const RowFields: React.FC<RowFieldsProps> = (props) => {
  const { values, type, first, empty } = props;

  return (
    <>
      <Table.Cell>{!empty && (first ? 'if' : 'and')}</Table.Cell>
      {values.map((item, index) => {
        return (
          <Table.Cell key={index}>
            {item.value instanceof Array && typeof item.value[0] === 'object' ? (
              renderFieldsItems(item.value, type, (value, diffType, type, index) => {
                if (
                  (diffType === 'add' && type === 'after') ||
                  (diffType === 'remove' && type === 'before') ||
                  diffType === 'same'
                ) {
                  return (
                    <DiffFieldValue
                      key={index}
                      style={{
                        background: diffType === 'same' ? 'rgba(33,37,41,0.08)' : 'unset',
                      }}
                      type={diffType}
                      value={value as string}
                    />
                  );
                } else {
                  return null;
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
              res.push(<Table.Cell key={`cell-${i}`}></Table.Cell>);
            }
            return res;
          })()}
    </>
  );
};

interface RuleNameDiffProps {
  diffType: diffType;
  type: positionType;
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
  type: positionType;
  first?: boolean;
}

const ConditiondiffRemoveItem: React.FC<ConditiondiffRemoveItemProps> = (props) => {
  const { value, type, first } = props;

  return (
    <Table.Row className={`${fieldStyles['diff-item-remove']} ${styles['condition-diff-item']}`}>
      <RowFields
        values={KEYS.reduce<FieldValue[]>((pre, current) => {
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

  return (
    <Table.Row className={`${fieldStyles['diff-item-add']} ${styles['condition-diff-item']}`}>
      <RowFields
        values={KEYS.reduce<FieldValue[]>((pre, current) => {
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

  return (
    <Table.Row className={`${fieldStyles['diff-item-normal']} ${styles['condition-diff-item']}`}>
      <RowFields
        values={KEYS.reduce<FieldValue[]>((pre, current) => {
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

  return (
    <Table.Row className={`${fieldStyles['diff-item-normal']} ${styles['condition-diff-item']}`}>
      <RowFields
        empty
        values={KEYS.reduce<FieldValue[]>((pre, current) => {
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
  value: ChangeItem[];
  type: positionType;
  first?: boolean;
}

const ConditiondiffModifyItem: React.FC<ConditiondiffModifyItemProps> = (props) => {
  const { value, type, first } = props;

  return (
    <Table.Row className={`${fieldStyles['diff-item-normal']} ${styles['condition-diff-item']}`}>
      {renderField(value, type, (map) => {
        return (
          <RowFields
            values={KEYS.reduce<FieldValue[]>((pre, current) => {
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
  type: positionType;
  serve?: unknown;
  title?: ReactNode;
}

const ConditionModifyContent: React.FC<ConditionContentProps> = (props) => {
  const { diffContent, type, serve, title } = props;

  const render = () => {
    let emptyCount = 0;
    return renderFieldsItems<ICondition>(diffContent, type, (value, diffType, type, index) => {
      if (diffType === 'remove' && type === 'before') {
        return (
          <ConditiondiffRemoveItem
            key={index}
            type={type}
            value={makeBetween(value)}
            first={index - emptyCount === 0}
          />
        );
      } else if (diffType === 'add' && type === 'after') {
        return (
          <ConditiondiffAddItem
            key={index}
            type={type}
            value={makeBetween(value)}
            first={index - emptyCount === 0}
          />
        );
      } else if (diffType === 'modify') {
        return (
          <ConditiondiffModifyItem
            key={index}
            type={type}
            value={value as ChangeItem[]}
            first={index - emptyCount === 0}
          />
        );
      } else if (diffType === 'same') {
        return (
          <ConditiondiffSameItem
            key={index}
            value={makeBetween(value)}
            first={index - emptyCount === 0}
          />
        );
      } else {
        if (emptyCount >= 0) {
          emptyCount++;
        }
        return <ConditiondiffEmptyItem key={index} value={makeBetween(value)} first={index === 0} />;
      }
    });
  };

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={fieldStyles['table-header']}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {diffContent && render()}
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
  const newContent: ICondition[] = makeBetween(content);

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']} ${fieldStyles['diff-item-remove']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {newContent &&
            newContent.map((item, index) => {
              return (
                <ConditiondiffRemoveItem
                  key={index}
                  first={index === 0}
                  value={makeBetween(item)}
                  type="before"
                />
              );
            })}
          {serve && <DiffServeContent diffType="remove" content={serve} type="before" />}
        </Table.Body>
      </Table>
    </div>
  );
};

const ConditionAddContent: React.FC<ConditionRemoveContentProps> = (props) => {
  const { content, serve, title } = props;
  const newContent: ICondition[] = makeBetween(content);

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']} ${fieldStyles['diff-item-add']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {newContent &&
            newContent.map((item, index) => {
              return (
                <ConditiondiffAddItem
                  key={index}
                  first={index === 0}
                  value={makeBetween(item)}
                  type="after"
                />
              );
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
  const newContent: ICondition[] = makeBetween(content);

  return (
    <div>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6">{title}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {newContent &&
            newContent.map((item, index) => {
              return <ConditiondiffSameItem key={index} first={index === 0} value={makeBetween(item)} />;
            })}
          {serve && <DiffServeContent diffType="same" type={type} content={serve} />}
        </Table.Body>
      </Table>
    </div>
  );
};

const ConditionEmptyContent: React.FC<ConditionSameContentProps> = (props) => {
  const { content, serve, type } = props;
  const newContent: ICondition[] = makeBetween(content);

  return (
    <div className={styles['empty']}>
      <Table basic="very" unstackable size="small">
        <Table.Header className={`${fieldStyles['table-header']}`}>
          <Table.Row>
            <Table.HeaderCell colSpan="6"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {newContent &&
            newContent.map((item, index) => {
              return <ConditiondiffEmptyItem key={index} value={makeBetween(item)} />;
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
        {renderFieldsItems<IRule>(content, 'before', (value, type, _, index) => {
          if (type === 'remove') {
            return (
              <ConditionRemoveContent
                key={index}
                title={(value as IRule).name}
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
              />
            );
          } else if (type === 'modify') {
            return renderField(value as DiffResult, 'before', (map) => {
              const conditions = map.get('conditions');
              const serve = map.get('serve');
              const name = map.get('name');
              if (conditions && conditions.type === 'modify') {
                return (
                  <ConditionModifyContent
                    key={index}
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
                    key={index}
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
                key={index}
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
                type={'before'}
              />
            );
          }
        })}
      </div>
      <div>
        {renderFieldsItems<IRule>(content, 'after', (value, type, _, index) => {
          if (type === 'add') {
            return (
              <ConditionAddContent
                key={index}
                title={(value as IRule).name}
                serve={(value as IRule).serve}
                content={(value as IRule).conditions}
              />
            );
          } else if (type === 'modify') {
            return renderField(value as ChangeItem[], 'after', (map) => {
              const conditions = map.get('conditions');
              const serve = map.get('serve');
              const name = map.get('name');
              if (conditions && conditions.type === 'modify') {
                return (
                  <ConditionModifyContent
                    key={index}
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
                    key={index}
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
                key={index}
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
