import { ReactNode, SyntheticEvent, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Dropdown, DropdownProps, Popup } from 'semantic-ui-react';
import Icon from 'components/Icon';
import { IPrerequisite, IToggleInfo, IVariation } from 'interfaces/targeting';
import { prerequisiteContainer, hooksFormContainer } from '../../provider';

import styles from './index.module.scss';

interface IProps {
  item?: IPrerequisite;
  index: number;
  prerequisiteToggles?: IToggleInfo[];
}

interface IOption {
  key: string;
  value: string;
  disabled?: boolean;
  type?: string;
  text: ReactNode | string;
  content?: ReactNode | string;
}

interface IMergeVariation {
  value: string;
  name: string;
  descriptions: string[];
}

function findRecordsByField<T, K extends keyof T>(
  records: T[],
  field: K,
): T[] {
  const map = new Map<T[K], T[]>();

  records.forEach((record) => {
    const value = record[field];
    if (!map.has(value)) {
      map.set(value, []);
    }
    map.get(value)?.push(record);
  });

  const result: T[] = [];
  map.forEach((records) => {
    if (records.length > 1) {
      result.push(...records);
    }
  });

  return result;
}

const PrerequisiteItem = (props: IProps) => {
  const { item, index, prerequisiteToggles } = props;
  const intl = useIntl();

  const {
    formState: { errors },
    setValue,
    trigger,
    register,
    setError,
    getValues,
    unregister,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const {
    prerequisites,
    handlecChangePrerequisite,
    handleDeletePrerequisite,
  } = prerequisiteContainer.useContainer();

  useEffect(() => {
    register(`prerequisite_${item?.id}_toggle`, {
      required: {
        value: true,
        message: intl.formatMessage({id: 'prerequisite.toggle.placeholder'})
      },
    });

    register(`prerequisite_${item?.id}_returnValue`, {
      required: {
        value: true,
        message: intl.formatMessage({id: 'prerequisite.return.value.placeholder'})
      },
    });
  }, [intl, item?.id, register]);

  const getToggleOptions = useCallback(() => {
    const options: IOption[] = [];

    prerequisiteToggles?.forEach((toggle: IToggleInfo) => {
      options.push({
        key: toggle.key,
        value: toggle.key,
        disabled: toggle.returnType === 'json',
        text: (
          <span className={styles['dropdown-toggle']}>
            <span className={styles['toggle-name']}>
              {toggle.key}
            </span>
            {
              toggle.returnType === 'json' ? (
                <Popup
                  inverted
                  className={styles.popup}
                  position='top center'
                  trigger={
                    <div>
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
                    </div>
                  }
                  content={<FormattedMessage id='prerequisite.json.not.support' />}
                />
              ) : (
                <div>
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
                </div>
              )
            }
          </span>
        )
      });
    });

    return options;
  }, [prerequisiteToggles, intl]);

  const getToggleValueOptions = useCallback(() => {
    const options: IOption[] = [];

    if (prerequisiteToggles) {
      const existingToggle = prerequisiteToggles.find((toggle: IToggleInfo) => toggle.key === item?.key);

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
                  variation.descriptions.map((description: string, index: number) => (
                    <div key={index} className={styles['value-description']}>
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
  }, [prerequisiteToggles, item?.key]);

  const getToggleType = useCallback((toggleKey: string) => {
    const existingToggle = prerequisiteToggles?.find((toggle: IToggleInfo) => toggle.key === toggleKey);
    return existingToggle?.returnType;
  }, [prerequisiteToggles]);

  const checkExistToggles = useCallback(() => {
    clearErrors();
    const existingPrerequite = findRecordsByField<IPrerequisite, 'key'>(prerequisites, 'key');
    existingPrerequite?.map((pre: IPrerequisite) => {
      setError(
        `prerequisite_${pre.id}_toggle`, 
        {
          message: intl.formatMessage({id: 'prerequisite.toggle.duplicate'}),
        }
      );
    });
  }, [clearErrors, intl, prerequisites, setError]);

  const handleDelete = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();

    for(const key in getValues()) {
      if (key.startsWith(`prerequisite_${item?.id}_`)) {
        unregister(key);
        clearErrors(key);
      }
    }

    for(const key in errors) {
      if (key.startsWith(`prerequisite_${item?.id}_`)) {
        clearErrors(key);
      }
    }

    handleDeletePrerequisite(index);
    checkExistToggles();
  }, [checkExistToggles, handleDeletePrerequisite, index, getValues, item?.id, unregister, clearErrors, errors]);

  const handleChangeToggle = useCallback(async (detail: DropdownProps) => {
    const type = getToggleType(detail.value as string);
    handlecChangePrerequisite(index, detail.value, type, null);
    setValue(detail.name, detail.value);
    await trigger(`prerequisite_${item?.id}_toggle`);
    checkExistToggles();
  }, [getToggleType, handlecChangePrerequisite, index, setValue, trigger, item?.id, checkExistToggles]);
  
  return (
    <div className={styles.title}>
      <div className={styles['title-left']}>
        <Dropdown
          fluid 
          selection
          floating
          search
          selectOnBlur={false}
          name={`prerequisite_${item?.id}_toggle`}
          value={item?.key}
          placeholder={intl.formatMessage({id: 'prerequisite.toggle.placeholder'})} 
          options={getToggleOptions()} 
          icon={<Icon customclass={'angle-down'} type='angle-down' />}
          error={ errors[`prerequisite_${item?.id}_toggle`] ? true : false }
          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
            handleChangeToggle(detail);
          }}
        />
        {errors[`prerequisite_${item?.id}_toggle`] && (
          <div className={'error-text-normal'}>
            {errors[`prerequisite_${item?.id}_toggle`].message}
          </div>
        )}
      </div>
      <div className={styles['title-right']}>
        <Dropdown
          fluid 
          selection
          floating
          selectOnBlur={false}
          value={item?.value}
          name={`prerequisite_${item?.id}_returnValue`}
          placeholder={intl.formatMessage({id: 'prerequisite.return.value.placeholder'})}
          options={getToggleValueOptions()} 
          icon={<Icon customclass={'angle-down'} type='angle-down' />}
          error={ errors[`prerequisite_${item?.id}_returnValue`] ? true : false }
          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
            handlecChangePrerequisite(index, item?.key, item?.type, detail.value);
            setValue(detail.name, detail.value);
            await trigger(`prerequisite_${item?.id}_returnValue`);
          }}
        />
        {errors[`prerequisite_${item?.id}_returnValue`] && (
          <div className={'error-text-normal'}>
            {errors[`prerequisite_${item?.id}_returnValue`].message}
          </div>
        )}
      </div>
      <div>
        <Icon
          type='minus'
          customclass={styles['icon-minus']}
          onClick={(e: SyntheticEvent) => {
            handleDelete(e);
          }}
        />
      </div>
    </div>
  );
};

export default PrerequisiteItem;
