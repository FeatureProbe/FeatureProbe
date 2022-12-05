import { useEffect, useState, SyntheticEvent, ChangeEvent, useCallback } from 'react';
import { Dropdown, Input, DropdownItemProps, DropdownProps, Form } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { cloneDeep } from 'lodash';
import Icon from 'components/Icon';
import { IServe, IVariation } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import { VariationColors } from 'constants/colors';
import { useFormErrorScrollIntoView } from 'hooks';
import styles from './index.module.scss';

interface IAttr {
  [key: string]: string;
}
interface IProps {
  index?: number;
  id?: string;
  disabled?: boolean;
  variations: IVariation[];
  serve?: IServe;
  handleChangeServe: (item: IServe) => void;
  hooksFormContainer: IContainer;
  customStyle?: IAttr;
}

type IDropItemProps = Partial<DropdownItemProps>;

const TOTAL = 100;
const MIN = 0;

const Serve = (props: IProps) => {
  const {
    id,
    index,
    serve,
    disabled,
    variations,
    customStyle,
    hooksFormContainer,
    handleChangeServe,
  } = props;

  const [ value, saveValue ] = useState<string | number | boolean | (string | number | boolean)[] | undefined>(-1);
  const [ percentageShow, setPercentageShow ] = useState<boolean>(false);
  const [ variationsInUse, setVariationsInUse ] = useState<IVariation[]>([]);
  const [ variationsOptions, setVariatiosOptions ] = useState<IDropItemProps[]>([]);
  const [ total, setTotal ] = useState<number>(0);
  const intl = useIntl();

  const {
    formState: { errors },
    setValue,
    trigger,
    register,
    setError,
    clearErrors,
  } = hooksFormContainer.useContainer();
  const { registerErrorName } = useFormErrorScrollIntoView();

  useEffect(() => {
    setVariationsInUse(cloneDeep(variations));
  }, [variations]);

  useEffect(() => {
    const options: IDropItemProps[] = variationsInUse.map((item: IDropItemProps, index: number) => {
      return {
        value: index,
        text: item.name || item.value,
        content: (
          <div className={styles['dropdown-variation']}>
            <span style={{background: VariationColors[index % 20]}} className={styles['dropdown-variation-color']}></span>
            <span className={styles['dropdown-variation-text']}>
              { item.name || item.value }
            </span>
          </div>
        ),
      };
    });

    options.push({
      text: intl.formatMessage({id: 'targeting.serve.percentage.rollout'}),
      value: variationsInUse.length,
    });

    setVariatiosOptions(options);
  }, [intl, variationsInUse]);

  useEffect(() => {
    if (serve?.split) {
      setPercentageShow(true);
      saveValue(variationsInUse.length);
      let total = 0;
      variationsInUse?.forEach((variation: IVariation, index: number) => {
        variation.inputValue = (serve.split?.[index] ?? 0) / TOTAL;
        variation.percentage = variation.inputValue + '%';
        total += Number(variation.inputValue);
      });
      setTotal(total);
    } else if (serve?.select !== undefined) {
      setPercentageShow(false);
      if (serve.select >= variationsInUse.length) {
        saveValue(-1);
        setValue(id ? `rule_${id}_serve` : 'defaultServe', null);
        setError(id ? `rule_${id}_serve` : 'defaultServe');
      } else {
        saveValue(serve.select);
        setValue(id ? `rule_${id}_serve`: 'defaultServe', serve.select);
        clearErrors(id ? `rule_${id}_serve`: 'defaultServe');
      }
    } else {
      setPercentageShow(false);
      saveValue(-1);
    }
  }, [id, index, serve, variationsInUse, setValue, setError, clearErrors]);

  useEffect(() => {
    if (total !== TOTAL && percentageShow) {
      setError(id ? `rule_${id}_serve_total` : 'defaultServe_total', { message: 'total is not 100%' });
    } else {
      clearErrors(id ? `rule_${id}_serve_total`: 'defaultServe_total');
    }
  }, [id, total, index, percentageShow, setError, clearErrors]);

  const handleChange = useCallback((event: SyntheticEvent, data: DropdownProps) => {
    if (data.value === variations.length) {
      setPercentageShow(true);
      const split = variationsInUse.map((variation) => {
        return Number(variation.inputValue || 0) * TOTAL;
      });
      handleChangeServe({
        split,
      });
    } else {
      setPercentageShow(false);
      handleChangeServe({
        select: Number(data.value),
      });
    }
    saveValue(data.value);
    setTotal(0);
  }, [variations.length, variationsInUse, handleChangeServe]);

  const changePercentage = useCallback((index: number, value: number) => {
    if (value < 0) {
      value = 0;
    } else if (value > TOTAL) {
      value = TOTAL;
    }

    let total = 0;
    variationsInUse[index].inputValue = value;

    if (variationsInUse.length == 2) {
      // auto adjustment to keep the total rollout is 100%
      variationsInUse[1 - index].inputValue = TOTAL - value;
    }

    variationsInUse.forEach(variation => {
      if (variation.inputValue) {
        total += Number(variation.inputValue);
      }
    });

    variationsInUse.forEach(variation => {
      if (variation.inputValue) {
        if (total > TOTAL) {
          variation.percentage = Number(variation.inputValue) / total * TOTAL + '%';
        } else {
          variation.percentage = Number(variation.inputValue) + '%';
        }
      } else {
        variation.percentage = '0%';
      }
    });

    const split = variationsInUse.map((variation) => {
      return Number(variation.inputValue || 0) * TOTAL;
    });

    handleChangeServe({
      split,
    });

    setTotal(total);
  }, [variationsInUse, handleChangeServe]);

  const handleInputChange = useCallback((e: ChangeEvent, index: number) => {
    changePercentage(index, Number((e.target as HTMLInputElement).value) || MIN);
  }, [changePercentage]);

  const handleMinus = useCallback((index: number) => {
    const value = Number(variationsInUse[index].inputValue);
    if (value <= MIN || disabled) {
      return;
    }
    changePercentage(index, value - 1);
  }, [disabled, variationsInUse, changePercentage]);

  const handleAdd = useCallback((index: number) => {
    const value = Number(variationsInUse[index].inputValue);
    if (value >= TOTAL || disabled) {
      return;
    }
    changePercentage(index, value + 1);
  }, [disabled, variationsInUse, changePercentage]);

	return (
    <div className={styles.serve}>
      <div className={styles['serve-select']}>
        <span className={styles['serve-text']}>
          <span className={styles['label-required']}>*</span>
          <FormattedMessage id='common.serve.text' />
        </span>
        <Form.Field className={styles['serve-form-field']} style={customStyle}>
          <Dropdown
            placeholder={intl.formatMessage({id: 'targeting.serve.required'})}
            className={styles['serve-dropdown']}
            style={customStyle}
            selection
            floating
            value={value}
            openOnFocus={false}
            disabled={disabled}
            options={variationsOptions}
            error={ errors[id ? `rule_${id}_serve`: 'defaultServe'] ? true : false }
            {
              ...register(id ? `rule_${id}_serve`: 'defaultServe', { 
                required: true,
              })
            }
            onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
              handleChange(e, detail);
              setValue(detail.name, detail.value);
              await trigger(id ? `rule_${id}_serve`: 'defaultServe');
            }}
            icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
          />
          { errors[id ? `rule_${id}_serve`: 'defaultServe'] && <div className={styles['error-text']}>
            { intl.formatMessage({id: 'targeting.serve.required'}) }
          </div> }
        </Form.Field>
      </div>
      {
        percentageShow && (
          <div className={styles['percentage-content']}>
            <div className={styles.percentage}>
              {
                variationsInUse.map((item: IVariation, index: number) => {
                  return (
                    <span 
                      key={item.value + '_' + index}
                      style={{width: item.percentage, background: VariationColors[index % 20]}} 
                      className={styles['percentage-item']}
                    />
                  );
                })
              }
            </div>
            {
              total !== TOTAL && (
                <div {...registerErrorName(id ? `rule_${id}_serve_total` : 'defaultServe_total')} className={styles.message}>
                  <Icon customclass={styles['message-iconfont']} type='remove-circle' />
                  {
                    intl.formatMessage({
                      id: 'targeting.serve.percentage.error.text'
                    }, {
                      value: TOTAL - total
                    })
                  }
                </div>
              )
            }
            <div className={styles.variation}>
              {
                variationsInUse?.map((item: IVariation, index: number) => {
                  return (
                    <div key={item.id} className={styles['variation-item']}>
                      <Input 
                        size='mini'
                        className={styles['variation-item-input']}
                        value={item.inputValue ?? ''}
                        disabled={disabled}
                        onChange={(e: ChangeEvent) => handleInputChange(e, index)}
                        icon={
                          <div>
                            <span className={styles['input-percentage']}>%</span>
                            <span className={styles['input-operation']}>
                              <Icon customclass={styles['iconfont']} type='angle-up' onClick={() => handleAdd(index)} />
                              <Icon customclass={styles['iconfont']} type='angle-down' onClick={() => handleMinus(index)} />
                            </span>
                          </div>
                        }
                      />

                      <div className={styles['variation-name']}>
                        <span style={{ background: VariationColors[index % 24] }} className={styles['variation-name-color']}></span>
                        <span className={styles['variation-name-text']}>
                          { item.name || item.value }
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )
      }
    </div>
	);
};

export default Serve;