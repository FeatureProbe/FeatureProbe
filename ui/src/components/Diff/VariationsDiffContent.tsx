import { FormattedMessage } from 'react-intl';
import { Table } from 'semantic-ui-react';
import { diffType, positionType } from './constants';
import { DiffResult } from './diff';
import { DiffFieldValue } from './DiffFieldValue';
import { renderField, renderFieldsItems } from './renderDiff';
import fieldStyles from './fields.module.scss';
import styles from './VariationsDiffContent.module.scss';

type DiffFieldValue = {
  type: diffType;
  value: string;
};

interface VariationsField {
  name?: string;
  value?: string;
  description?: string;
}

const VariationsModifyDiffItem: React.FC<{ content: DiffResult; type: positionType }> = (props) => {
  const { content, type } = props;

  return (
    <Table.Row className={styles['diff-item']}>
      {renderField(content, type, (map) => {
        const name = map.get('name');
        const value = map.get('value');
        const description = map.get('description');
        return (
          <>
            <Table.Cell className={styles['table-item-name']}>
              {name ? <DiffFieldValue type={name.type} value={name.value as string} /> : 'null'}
            </Table.Cell>
            <Table.Cell>
              {value ? <DiffFieldValue type={value.type} value={value.value as string} /> : 'null'}
            </Table.Cell>
            <Table.Cell>
              {description ? <DiffFieldValue type={description.type} value={description.value as string} /> : 'null'}
            </Table.Cell>
          </>
        );
      })}
    </Table.Row>
  );
};

const VariationsCountDiffItem: React.FC<{
  content: VariationsField;
  diffType: diffType;
  type: positionType;
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

const VariationsDiffContent: React.FC<VariationsDiffContentProps> = (props) => {
  const { content } = props;

  return (
    <div className={fieldStyles['diff-content']}>
      <div className={fieldStyles['before']}>
        <div className={fieldStyles['diff-fields']}>
          <Table basic="very" unstackable size="small">
            <Table.Header className={fieldStyles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['table-header-name']}>
                  <FormattedMessage id="common.name.lowercase.text" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="common.value.text" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="common.description.lowercase.text" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {content &&
                renderFieldsItems<VariationsField>(content, 'before', (value, diffType, _, index) => {
                  if (diffType === 'modify') {
                    return <VariationsModifyDiffItem key={index} type="before" content={value as DiffResult} />;
                  } else {
                    return (
                      <VariationsCountDiffItem key={index} diffType={diffType} type="before" content={value as VariationsField} />
                    );
                  }
                })}
            </Table.Body>
          </Table>
        </div>
      </div>
      <div className={fieldStyles['after']}>
        <div className={fieldStyles['diff-fields']}>
          <Table basic="very" unstackable size="small">
            <Table.Header className={fieldStyles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['table-header-name']}>
                  <FormattedMessage id="common.name.lowercase.text" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="common.value.text" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="common.description.lowercase.text" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {content &&
                renderFieldsItems<VariationsField>(content, 'after', (value, diffType, _, index) => {
                  if (diffType === 'modify') {
                    return <VariationsModifyDiffItem key={index} type="after" content={value as DiffResult} />;
                  } else {
                    return (
                      <VariationsCountDiffItem key={index} diffType={diffType} type="after" content={value as VariationsField} />
                    );
                  }
                })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VariationsDiffContent;
