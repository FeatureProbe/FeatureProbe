import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { prerequisiteContainer } from '../../provider';
import PrerequisiteItem from './item';

import styles from './index.module.scss';
import { IPrerequisite, IToggleInfo } from 'interfaces/targeting';

interface IProps {
  prerequisiteToggle?: IToggleInfo[];
}

const Prerequisite = (props: IProps) => {
  const { prerequisiteToggle } = props;

  const { 
    prerequisite,
    handleAddPrerequisite,
  } = prerequisiteContainer.useContainer();

  const addPrerequisite = useCallback(() => {
    handleAddPrerequisite(undefined, undefined);
  }, [handleAddPrerequisite]);

  return (
    <div className={styles.prerequisite}>
      {
        (prerequisite && prerequisite.length > 0) && (
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
        prerequisite?.map((item: IPrerequisite, index: number) => {
          return (
            <PrerequisiteItem 
              item={item}
              index={index}
              prerequisiteToggle={prerequisiteToggle}
            />
          );
        })
      }
      
      <div className={styles.add}>
        <Button
          primary
          tyzpe='button'
          className={styles['add-btn']}
          onClick={addPrerequisite}
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
