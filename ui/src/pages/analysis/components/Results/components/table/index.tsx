import { FormattedMessage } from 'react-intl';
import { Table } from 'semantic-ui-react';
import { VariationColors } from 'constants/colors';
import { ITableData } from 'interfaces/analysis';
import styles from './index.module.scss';

interface IProps {
  data?: ITableData[];
}

const ResultTable = (props: IProps) => {
  const { data } = props;
  
  return (
    <div>
      <Table basic="very" unstackable>
        <Table.Header className={styles['table-header']}>
          <Table.Row>
            <Table.HeaderCell className={styles['column-variation']}>
              <FormattedMessage id='analysis.result.table.name' />
            </Table.HeaderCell>
            <Table.HeaderCell className={styles['column-probability']}>
              <FormattedMessage id='analysis.result.table.percentage' />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id='analysis.result.table.credibleInterval' />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id='analysis.result.table.mean' />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className={styles['table-body']}>
          {
            data?.map((item, index) => {
              return (
                <Table.Row key={index} className={styles['list-item']}>
                  <Table.Cell className={styles['column-variation']}>
                    <div className={styles.name}>
                      <span className={styles['name-color']} style={{background: VariationColors[index]}}></span>
                      <span>{item.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className={styles.probability}>
                    <div className={styles['probability-text']}>
                      {(Number(item.winningPercentage) * 100).toFixed(2) + '%'}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    [
                      {item.credibleInterval?.lower}, 
                      {item.credibleInterval?.upper}
                    ]
                  </Table.Cell>
                  <Table.Cell>
                    {item.mean}
                  </Table.Cell>
                </Table.Row>
              );
            })
          }
        </Table.Body>
      </Table>
    </div>
  );
};

export default ResultTable;
