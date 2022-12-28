import { ArrayChange } from 'diff';
import { ReactNode } from 'react';
import { Table } from 'semantic-ui-react';
import { ArrayObj, DiffResult } from './diff';
import { DiffChangeType, DiffFieldValue } from './DiffFieldValue';
import fieldStyles from './fields.module.scss';
import styles from './VariationsDiffContent.module.scss';

type DiffFieldValue = {
  type: DiffChangeType;
  value: string;
};

interface VariationsFieldType {
  name?: DiffFieldValue;
  value?: DiffFieldValue;
  description?: DiffFieldValue;
}

interface VariationsField {
  name?: string;
  value?: string;
  description?: string;
}

const VariationsModifyDiffItem: React.FC<{ content: DiffResult; type: 'before' | 'after' }> = (props) => {
  const { content, type } = props;
  const after = type === 'after';
  const obj: VariationsFieldType = content.reduce((pre, current) => {
    let results = null;
    let type = '';
    if (current.added && !after) {
      return pre;
    }
    if (current.removed && after) {
      return pre;
    }
    if (current.added) {
      type = 'add';
    }
    if (current.removed) {
      type = 'remove';
    }
    results = current.value.reduce<VariationsFieldType>((pre, current) => {
      if ((current as ArrayObj).__key) {
        Object.defineProperty(pre, (current as ArrayObj).__key as string, {
          value: {
            type,
            value: (current as ArrayObj).__value,
          },
          enumerable: true,
        });
      }
      return pre;
    }, {});
    return {
      ...pre,
      ...results,
    };
  }, {});

  return (
    <Table.Row className={styles['diff-item']}>
      <Table.Cell className={styles['table-item-name']}>
        {obj.name ? <DiffFieldValue type={obj.name.type} value={obj.name.value} /> : 'null'}
      </Table.Cell>
      <Table.Cell>{obj.value ? <DiffFieldValue type={obj.value.type} value={obj.value.value} /> : 'null'}</Table.Cell>
      <Table.Cell>
        {obj.description ? <DiffFieldValue type={obj.description.type} value={obj.description.value} /> : 'null'}
      </Table.Cell>
    </Table.Row>
  );
};

const VariationsCountDiffItem: React.FC<{
  content: VariationsField;
  diffType: 'add' | 'remove';
  type: 'after' | 'before';
}> = (props) => {
  const { content, diffType, type } = props;
  const obj = content;
  const empty = (diffType === 'add' && type === 'before') || (diffType === 'remove' && type === 'after');

  return (
    <Table.Row className={`${styles['diff-item']} ${!empty ? fieldStyles[`diff-item-${diffType}`] : ''}`}>
      <Table.Cell className={styles['table-item-name']}>
        {obj.name && !empty && <DiffFieldValue value={obj.name} />}
      </Table.Cell>
      <Table.Cell>{obj.value && !empty && <DiffFieldValue value={obj.value} />}</Table.Cell>
      <Table.Cell>{obj.description && !empty && <DiffFieldValue value={obj.description} />}</Table.Cell>
    </Table.Row>
  );
};

interface VariationsDiffContentProps {
  content: DiffResult;
}

const renderFields = (diffContent: DiffResult, type: 'before' | 'after') => {
  let values: ReactNode[] = [];
  for (let i = 0; i < diffContent.length; i++) {
    const diffItem = diffContent[i];
    if (diffItem.modified) {
      values = values.concat(
        diffItem.value.map((item) => {
          return <VariationsModifyDiffItem content={(item as ArrayChange<ArrayChange<unknown>>).value} type={type} />;
        })
      );
    }
    if (diffItem.removed) {
      values = values.concat(
        diffItem.value.map((item) => {
          return <VariationsCountDiffItem type={type} content={item as VariationsField} diffType="remove" />;
        })
      );
    }
    if (diffItem.added) {
      values = values.concat(
        diffItem.value.map((item) => {
          return <VariationsCountDiffItem type={type} content={item as VariationsField} diffType="add" />;
        })
      );
    }
  }
  return values;
};

const VariationsDiffContent: React.FC<VariationsDiffContentProps> = (props) => {
  const {content} = props;

  return (
    <div className={fieldStyles['diff-content']}>
      <div className={fieldStyles['before']}>
        <div className={fieldStyles['diff-fields']}>
          <Table basic="very" unstackable size="small">
            <Table.Header className={fieldStyles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['table-header-name']}>name</Table.HeaderCell>
                <Table.HeaderCell>value</Table.HeaderCell>
                <Table.HeaderCell>description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{content && renderFields(content, 'before')}</Table.Body>
          </Table>
        </div>
      </div>
      <div className={fieldStyles['after']}>
        <div className={fieldStyles['diff-fields']}>
          <Table basic="very" unstackable size="small">
            <Table.Header className={fieldStyles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['table-header-name']}>name</Table.HeaderCell>
                <Table.HeaderCell>value</Table.HeaderCell>
                <Table.HeaderCell>description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{content && renderFields(content, 'after')}</Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VariationsDiffContent;
