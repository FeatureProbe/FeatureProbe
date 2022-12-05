import { SyntheticEvent, useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import styles from './index.module.scss';

interface IProps {
  tags: string[];
  showCount?: number;
}

const TagsList = (props: IProps) => {
  const { tags, showCount } = props;
  const [ showTags, saveShowTags ] = useState<string[]>([]);
  const [ popupTags, savePopupTags ] = useState<string[]>([]);
  
  useEffect(() => {
    const length = tags.length;
    const maxShowCount = showCount || 5;

    if(length > maxShowCount) {
      saveShowTags(tags.slice(0, maxShowCount));
      savePopupTags(tags.slice(maxShowCount));
    } else {
      saveShowTags(tags);
    }
  }, [tags, showCount]);

  return (
    <div className={styles['tags-list']}>
      {
        showTags.map((val: string) => {
          return (
            <div className={styles.tags} key={val}>
              <span className={styles['tags-text']}>
                { val }
              </span>
            </div>
          );
        })
      }

      {
        popupTags.length > 0 && (
          <Popup
            basic
            on='click'
            position='bottom center'
            className={styles.popup}
            trigger={
              <span 
                className={styles['tags-more']} 
                onClick={(e: SyntheticEvent) => {
                  document.body.click();
                  e.stopPropagation();
                }}
              > 
                +{ popupTags.length }...
              </span>
            }
          >
            <div className={styles['popup-list']}>
              {
                popupTags.map((val: string) => {
                  return (
                    <div className={styles.tags} key={val}>
                      <span className={styles['tags-text']}>
                        { val }
                      </span>
                    </div>
                  );
                })
              }
            </div>
          </Popup>
        )
      }
    </div>
  );
};
  
export default TagsList;