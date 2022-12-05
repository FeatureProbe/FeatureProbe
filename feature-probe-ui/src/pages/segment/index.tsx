import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { 
  Table,
  Form,
  PaginationProps,
  InputOnChangeData,
} from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { debounce } from 'lodash';
import SegmentDrawer from './components/SegmentDrawer';
import SegmentItem from './components/SegmentItem';
import ProjectLayout from 'layout/projectLayout';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import EventTracker from 'components/EventTracker';
import NoData from 'components/NoData';
import Pagination from 'components/Pagination';
import Loading from 'components/Loading';
import { getSegmentList } from 'services/segment';
import { saveDictionary } from 'services/dictionary';
import { ISegment, ISegmentList } from 'interfaces/segment';
import { NOT_FOUND } from 'constants/httpCode';
import { LAST_SEEN } from 'constants/dictionary_keys';
import { Provider } from './provider';
import styles from './index.module.scss';

interface IParams {
  projectKey: string;
  environmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  disabled?: number;
  tags?: string[];
  keyword?: string;
}

const Segment = () => {
  const { projectKey, environmentKey } = useParams<IParams>();
  const [segmentList, setSegmentList] = useState<ISegment[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, setTotal ] = useState<number>(0);
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [ isAdd, setIsAdd ] = useState<boolean>(true);
  const [ isVisible, setIsVisible ] = useState<boolean>(false);
  const [ segmentKey, setSegmentKey ] = useState<string>('');
  const history = useHistory();
  const intl = useIntl();

  const fetchSegmentLists = useCallback(() => {
    saveIsLoading(true);
    getSegmentList<ISegmentList>(projectKey, searchParams).then(async (res) => {
      saveIsLoading(false);
      const { success, data, code } = res;
        if (success && data) {
          const { content, pageable, totalPages, totalElements } = data;
          setSegmentList(content || []);
          setPagination({
            pageIndex: (pageable?.pageNumber || 0) + 1,
            totalPages: totalPages || 1,
          });
          setTotal(totalElements || 0);
          return;
        } else if (!success && code === NOT_FOUND) {
          saveDictionary(LAST_SEEN, {});
          history.push('/notfound');
          return;
        } else {
          if (res.success)
          setSegmentList([]);
          setPagination({
            pageIndex: 1,
            totalPages: 1,
          });

          message.error(intl.formatMessage({id: 'segments.list.error.text'}));
        }
    });
  }, [projectKey, searchParams, intl, history]);

  useEffect(() => {
    fetchSegmentLists();
  }, [fetchSegmentLists]);

  const handleAddSegment = useCallback(() => {
    setIsAdd(true);
    setIsVisible(true);
  }, []);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1
    });
  }, [searchParams]);

  const handleSearch = debounce(useCallback((e: SyntheticEvent, data: InputOnChangeData) => {
    setSearchParams({
      ...searchParams,
      keyword: data.value as string,
    });
  }, [searchParams]), 300);

  const handleEdit = useCallback((segmentKey: string) => {
    setIsAdd(false);
    setSegmentKey(segmentKey);
    setIsVisible(true);
  }, []);

  const handleClickItem = useCallback((segmentKey: string) => {
    history.push(`/${projectKey}/${environmentKey}/segments/${segmentKey}/targeting`);
  }, [environmentKey, history, projectKey]);

	return (
    <ProjectLayout>
      <Provider>
        <div className={styles.segments}>
          <div className={styles.card}>
            <div className={styles.heading}>
              <FormattedMessage id='common.segments.text' />
            </div>
            <div className={styles.add}>
              <Form className={styles['filter-form']}>
                <Form.Field className={styles['keywords-field']}>
                  <Form.Input 
                    placeholder={intl.formatMessage({id: 'toggles.filter.search.placeholder'})} 
                    icon={<Icon customclass={styles['icon-search']} type='search' />}
                    onChange={handleSearch}
                  />
                </Form.Field>
              </Form>
              <EventTracker category='segment' action='create-segment'>
                <Button primary className={styles['add-button']} onClick={handleAddSegment}>
                  <Icon customclass={styles['iconfont']} type='add' />
                  <FormattedMessage id='common.segment.text' />
                </Button>
              </EventTracker>
            </div>
            {
              isLoading ? (
                <div className={styles.lists}>
                  <Loading />
                </div>
              ) : (
                <div className={styles.lists}>
                  <div className={styles['table-box']}>
                    <Table className={styles.table} basic='very' unstackable>
                      <Table.Header className={styles['table-header']}>
                        <Table.Row>
                          <Table.HeaderCell className={styles['column-name']}>
                            <FormattedMessage id='common.name.text' />
                          </Table.HeaderCell>
                          <Table.HeaderCell className={styles['column-modify-by']}>
                            <FormattedMessage id='common.key.text' />
                          </Table.HeaderCell>
                          <Table.HeaderCell className={styles['column-modify-time']}>
                            <FormattedMessage id='common.description.text' />
                          </Table.HeaderCell>
                          <Table.HeaderCell className={styles['column-operation']}>
                            <FormattedMessage id='common.operation.text' />
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      {
                        segmentList.length !== 0 && (
                          <Table.Body>
                            {
                              segmentList?.map((segment: ISegment) => {
                                return (
                                  <SegmentItem 
                                    key={segment.key}
                                    segment={segment}
                                    fetchSegmentLists={fetchSegmentLists}
                                    handleEdit={handleEdit}
                                    handleClickItem={handleClickItem}
                                  />
                                );
                              })
                            }
                          </Table.Body>
                        )
                      }
                    </Table>
                    {
                      segmentList.length !== 0 ? (
                        <Pagination
                          total={total}
                          text={intl.formatMessage({id: 'segments.total'})}
                          pagination={pagination}
                          handlePageChange={handlePageChange}
                        />
                      ) : <NoData />
                    }
                  </div>
                </div>
              )
            }
          </div>
          <SegmentDrawer 
            isAdd={isAdd} 
            visible={isVisible}
            setDrawerVisible={setIsVisible}
            refreshSegmentsList={fetchSegmentLists}
            segmentKey={segmentKey}
            projectKey={projectKey}
          />
        </div>
      </Provider>
    </ProjectLayout>
	);
};

export default Segment;
