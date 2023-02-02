import { VariationColors } from 'constants/colors';
import { Table } from 'semantic-ui-react';
import styles from './index.module.scss';

const ResultTable = () => {
  return (
    <div>
      <Table basic="very" unstackable>
        <Table.Header className={styles['table-header']}>
          <Table.Row>
            <Table.HeaderCell className={styles['column-variation']}>
              分组名称
            </Table.HeaderCell>
            <Table.HeaderCell>
              胜出概率
            </Table.HeaderCell>
            <Table.HeaderCell>
              相对差异
            </Table.HeaderCell>
            <Table.HeaderCell>
              90%可信区间
            </Table.HeaderCell>
            <Table.HeaderCell>
              后验均值
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className={styles['table-body']}>
          <Table.Row className={styles['list-item']}>
            <Table.Cell className={styles['column-variation']}>
              <div className={styles.name}>
                <span className={styles['name-color']} style={{background: VariationColors[0]}}></span>
                <span>true</span>
              </div>
            </Table.Cell>
            <Table.Cell className={styles.probability}>
              20%
            </Table.Cell>
            <Table.Cell>
              [101.82%, 2222.23%]
            </Table.Cell>
            <Table.Cell>
              [0.01, 0.03]
            </Table.Cell>
            <Table.Cell>
              333
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default ResultTable;
