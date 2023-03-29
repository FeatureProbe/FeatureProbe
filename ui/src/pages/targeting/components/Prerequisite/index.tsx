import { SyntheticEvent, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IProps {
  disabled?: boolean;
}

const Prerequisite = (props: IProps) => {
  const intl = useIntl();

  const handleAddPrerequisite = useCallback(() => {
    // TODO
  }, []);

  const options = [
    { 
      key: '1',
      value: '1',
      text: (
        <span className={styles['dropdown-toggle']}>
          <span className={styles['toggle-name']}>
            Campaign Allow List
          </span>
          <span className={styles['enabled-tag']}>
            Enabled
          </span>
        </span>
      )
    },
    { 
      key: '2',
      value: '2',
      disabled: true,
      text: (
        <span className={styles['dropdown-toggle']}>
          <span className={styles['toggle-name']}>
            Campaign Allow List111
          </span>
          <span className={styles['disabled-tag']}>
            Disabled
          </span>
        </span>
      )
    },
    { 
      key: '3',
      value: '3',
      text: (
        <span className={styles['dropdown-toggle']}>
          <span className={styles['toggle-name']}>
            Campaign Allow dffff
          </span>
          <span className={styles['disabled-tag']}>
            Disabled
          </span>
        </span>
      )
    },
  ];

  const options1 = [
    { 
      key: '1',
      value: 'Value1',
      text: 'Value1',
      content: (
        <div>
          <div className={styles['dropdown-value']}>
            Value1
          </div>
          <div className={styles['value-description']}>
            Enabledadsfasdfasdfasdfasdfasdf
          </div>
        </div>
      )
    },
    { 
      key: '2',
      value: 'Value2',
      text: 'Value2',
      content: (
        <div>
          <div className={styles['dropdown-value']}>
            Value2
          </div>
          <div className={styles['value-description']}>
            1111Enabledadsfasdfasdfasdfasdfasdf
          </div>
          <div className={styles['value-description']}>
            3333Enabledadsfasdfasdfasdfasdfasdf
          </div>
        </div>
      )
    },
  ];

  return (
    <div className={styles.prerequisite}>
      <div className={`${styles.title} ${styles['prerequisite-title']}`}>
        <div className={styles['title-left']}>
          <FormattedMessage id='common.toggle.text' />
        </div>
        <div className={styles['title-right']}>
          <FormattedMessage id='prerequisite.return.value' />
        </div>
      </div>
      {
        [1, 2, 3].map(() => {
          return (
            <div className={styles.title}>
              <div className={styles['title-left']}>
                <Dropdown
                  fluid 
                  selection
                  floating
                  search
                  selectOnBlur={false}
                  // name='metricType'
                  // value={'1'}
                  placeholder={
                    intl.formatMessage({id: 'prerequisite.toggle.placeholder'})
                  } 
                  options={options} 
                  icon={<Icon customclass={'angle-down'} type='angle-down' />}
                  // error={ errors.metricType ? true : false }
                  onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                    console.log(detail);
                    // setValue(detail.name, detail.value);
                    // handleMetricTypeChange(e, detail);
                    // await trigger('metricType');
                  }}
                />
              </div>
              <div className={styles['title-right']}>
                <Dropdown
                  fluid 
                  selection
                  floating
                  selectOnBlur={false}
                  // name='metricType'
                  placeholder={
                    intl.formatMessage({id: 'prerequisite.return.value.placeholder'})
                  }
                  options={options1} 
                  icon={<Icon customclass={'angle-down'} type='angle-down' />}
                  // error={ errors.metricType ? true : false }
                  onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                    console.log(detail.value);
                    // setValue(detail.name, detail.value);
                    // handleMetricTypeChange(e, detail);
                    // await trigger('metricType');
                  }}
                >
                </Dropdown>
              </div>
              <div>
                <Icon
                  type='minus'
                  customclass={styles['icon-minus']}
                  onClick={() => {
                    //
                  }}
                />
              </div>
            </div>
          );
        })
      }
      
      <div className={styles.add}>
        <Button
          primary
          tyzpe='button'
          className={styles['add-btn']}
          onClick={handleAddPrerequisite}
        >
          <Icon type='add' customclass={styles.iconfont} />
          <span>
            <FormattedMessage id='prerequisite.add' />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Prerequisite;
