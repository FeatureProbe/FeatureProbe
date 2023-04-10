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

interface PrerequisitesField {
  key?: string;
  value?: string;
  type?: string;
}

const PrerequisitesModifyDiffItem: React.FC<{ content: DiffResult; type: positionType }> = (props) => {
  const { content, type } = props;

  return (
    <Table.Row className={styles['diff-item']}>
      {renderField(content, type, (map) => {
        const key = map.get('key');
        const value = map.get('value');
        return (
          <>
            <Table.Cell className={styles['table-item-name']}>
              {key ? <DiffFieldValue type={key.type} value={key.value as string} /> : 'null'}
            </Table.Cell>
            <Table.Cell>
              {value ? <DiffFieldValue type={value.type} value={value.value as string} /> : 'null'}
            </Table.Cell>
          </>
        );
      })}
    </Table.Row>
  );
};

const PrerequisitesCountDiffItem: React.FC<{
  content: PrerequisitesField;
  diffType: diffType;
  type: positionType;
}> = (props) => {
  const { content, diffType, type } = props;
  const obj = content;
  const empty = (diffType === 'add' && type === 'before') || (diffType === 'remove' && type === 'after');
  return (
    <Table.Row className={`${styles['diff-item']} ${!empty ? fieldStyles[`diff-item-${diffType}`] : ''}`}>
      <Table.Cell className={styles['table-item-name']}>
        {obj.key && !empty && <DiffFieldValue value={obj.key} />}
      </Table.Cell>
      <Table.Cell>{obj.value && !empty && <DiffFieldValue value={obj.value} />}</Table.Cell>
    </Table.Row>
  );
};

interface PrerequisitesDiffContentProps {
  content: DiffResult;
}

const PrerequisitesDiffContent: React.FC<PrerequisitesDiffContentProps> = (props) => {
  const { content } = props;

  return (
    <div className={fieldStyles['diff-content']}>
      <div className={fieldStyles['before']}>
        <div className={fieldStyles['diff-fields']}>
          <Table basic="very" unstackable size="small">
            <Table.Header className={fieldStyles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['table-header-name']}>
                  <FormattedMessage id="common.toggles.text" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="prerequisite.return.value" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {content &&
                renderFieldsItems<PrerequisitesField>(content, 'before', (value, diffType, _, index) => {
                  if (diffType === 'modify') {
                    return <PrerequisitesModifyDiffItem key={index} type="before" content={value as DiffResult} />;
                  } else {
                    return (
                      <PrerequisitesCountDiffItem key={index} diffType={diffType} type="before" content={value as PrerequisitesField} />
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
                  <FormattedMessage id="common.toggles.text" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="prerequisite.return.value" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {content &&
                renderFieldsItems<PrerequisitesField>(content, 'after', (value, diffType, _, index) => {
                  if (diffType === 'modify') {
                    return <PrerequisitesModifyDiffItem key={index} type="after" content={value as DiffResult} />;
                  } else {
                    return (
                      <PrerequisitesCountDiffItem key={index} diffType={diffType} type="after" content={value as PrerequisitesField} />
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

export default PrerequisitesDiffContent;
