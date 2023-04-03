import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import PrerequisiteItem from './item';
import { prerequisiteContainer } from '../../provider';
import { IPrerequisite, IToggleInfo } from 'interfaces/targeting';

import styles from './index.module.scss';

interface IProps {
  disabled?: boolean;
  prerequisiteToggles?: IToggleInfo[];
}

const Prerequisite = (props: IProps) => {
  const { disabled, prerequisiteToggles } = props;

  const { 
    prerequisites,
    handleAddPrerequisite,
  } = prerequisiteContainer.useContainer();

  const addPrerequisite = useCallback(() => {
    handleAddPrerequisite(undefined, undefined);
  }, [handleAddPrerequisite]);

  return (
    <div className={styles.prerequisite}>
      {
        (prerequisites && prerequisites.length > 0) && (
          <div className={`${styles.title} ${styles['prerequisite-title']}`}>
            <div className={styles['title-left']}>
              <FormattedMessage id='common.toggle.text' />
            </div>
            <div className={styles['title-right']}>
              <FormattedMessage id='prerequisite.return.value' />
            </div>
          </div>
        )
      }
      
      {
        prerequisites?.map((item: IPrerequisite, index: number) => {
          return (
            <PrerequisiteItem
              key={index}
              item={item}
              index={index}
              disabled={disabled}
              prerequisiteToggles={prerequisiteToggles}
            />
          );
        })
      }
      
      <div className={styles.add}>
        <Button
          primary
          type='button'
          className={styles['add-btn']}
          disabled={disabled}
          onClick={addPrerequisite}
        >
          <Icon type='add' customclass={styles.iconfont} />
          <FormattedMessage id='prerequisite.add' />
        </Button>
      </div>
    </div>
  );
};

export default Prerequisite;
