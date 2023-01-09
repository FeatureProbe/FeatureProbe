import { SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Pagination, PaginationProps } from 'semantic-ui-react';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IPagination {
  pageIndex: number;
  totalPages: number;
}

interface IProps {
  text?: string;
  total?: number;
  hideTotal?: boolean;
  pagination: IPagination;
  handlePageChange(e: SyntheticEvent, data: PaginationProps): void;
}

const CustomPagination = (props: IProps) => {
  const { total, text, hideTotal, pagination, handlePageChange } = props;

  return (
    <div className={styles.pagination}>
      {
        hideTotal ? <div className={styles['total']}></div> : (
          <div className={styles['total']}>
            <span className={styles['total-count']}>{total} </span>
            { text || <FormattedMessage id='common.total' /> }
          </div>
        )
      }
      {
        pagination.totalPages > 1 && (
          <Pagination 
            activePage={pagination.pageIndex} 
            totalPages={pagination.totalPages} 
            onPageChange={handlePageChange}
            firstItem={null}
            lastItem={null}
            prevItem={{
              content: (<Icon type='angle-left' />)
            }}
            nextItem={{
              content: (<Icon type='angle-right' />)
            }}
          />
        )
      }
    </div>
  );
};

export default CustomPagination;