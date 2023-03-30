import { ReactNode, SyntheticEvent, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import Icon from 'components/Icon';
import { IPrerequisite, IToggleInfo, IVariation } from 'interfaces/targeting';
import { prerequisiteContainer } from '../../provider';

import styles from './index.module.scss';

interface IProps {
  item?: IPrerequisite;
  index: number;
  prerequisiteToggle?: IToggleInfo[];
}

interface IOption {
  key: string;
  value: string;
  text: ReactNode | string;
  content?: ReactNode | string;
}

interface IMergeVariation {
  value: string;
  name: string;
  descriptions: string[];
}

const PrerequisiteItem = (props: IProps) => {
  const { item, index, prerequisiteToggle } = props;
  const intl = useIntl();

  const {
    handlecChangePrerequisite,
  } = prerequisiteContainer.useContainer();

  const getToggleOptions = useCallback(() => {
    const options: IOption[] = [];
    if (prerequisiteToggle) {
      prerequisiteToggle.forEach((toggle: IToggleInfo) => {
        options.push({
          key: toggle.key,
          value: toggle.key,
          text: (
            <span className={styles['dropdown-toggle']}>
              <span className={styles['toggle-name']}>
                {toggle.key}
              </span>
              {
                toggle.disabled ? (
                  <span className={styles['disabled-tag']}>
                    {intl.formatMessage({ id: 'common.disabled.text' })}
                  </span>
                ) : (
                  <span className={styles['enabled-tag']}>
                    {intl.formatMessage({ id: 'common.enabled.text' })}
                  </span>
                )
              }
              
            </span>
          )
        });
      });
    }

    return options;
  }, [prerequisiteToggle, intl]);

  const getToggleValueOptions = useCallback(() => {
    const options: IOption[] = [];

    if (prerequisiteToggle) {
      const existingToggle = prerequisiteToggle.find((toggle: IToggleInfo) => toggle.key === item?.key);

      if (existingToggle) {
        const mergedVariations: IMergeVariation[] = [];

        existingToggle.variations.forEach((variation: IVariation) => {
          const existingVariation = mergedVariations.find((v) => v.value === variation.value);

          if (existingVariation) {
            if (variation.description) {
              existingVariation.descriptions.push(variation.description);
            }
          } else {
            if (variation.name && variation.value) {
              mergedVariations.push({
                value: variation.value,
                name: variation.name,
                descriptions: variation.description ? [variation.description] : []
              });
            }
          }
        });

        mergedVariations.map((variation: IMergeVariation) => {
          options.push({
            key: variation.value,
            value: variation.value,
            text: variation.value,
            content: (
              <div>
                <div className={styles['dropdown-value']}>
                  {variation.value}
                </div>
                {
                  variation.descriptions.map((description: string) => (
                    <div className={styles['value-description']}>
                      {description}
                    </div>
                  ))
                }
              </div>
            )
          });
        });
      }
    }

    return options;
  }, [prerequisiteToggle, item?.key]);
  
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
          value={item?.key}
          placeholder={intl.formatMessage({id: 'prerequisite.toggle.placeholder'})} 
          options={getToggleOptions()} 
          icon={<Icon customclass={'angle-down'} type='angle-down' />}
          // error={ errors.metricType ? true : false }
          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
            console.log(detail.value);
            handlecChangePrerequisite(index, detail.value, null);
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
          value={item?.value}
          // name='metricType'
          placeholder={
            intl.formatMessage({id: 'prerequisite.return.value.placeholder'})
          }
          options={getToggleValueOptions()} 
          icon={<Icon customclass={'angle-down'} type='angle-down' />}
          // error={ errors.metricType ? true : false }
          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
            handlecChangePrerequisite(index, item?.key, detail.value);
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
};

export default PrerequisiteItem;
