import { SyntheticEvent, useCallback, useState, useMemo, useEffect } from 'react';
import { DropdownProps, Form, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import Icon from 'components/Icon';
import JsonEditor from 'components/JsonEditor';
import Modal from '../Modal';
import { VariationColors } from 'constants/colors';
import { IContainer } from 'interfaces/provider';
import { isJSON } from 'utils/tools';
import styles from './index.module.scss';

interface IItem {
  id?: string;
  index: number;
  name?: string;
  value?: string;
  description?: string;
}

interface IProps {
  disabled?: boolean;
  total: number;
  returnType: string;
  item: IItem;
  prefix?: string;
  handleInput(e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps): void;
  handleChangeVariation(index: number, value: string): void;
  handleDelete(index: number): void;
  hooksFormContainer: IContainer;
}

const VariationItem = (props: IProps) => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ canSave, setCanSave ] = useState<boolean>(true);
  const [ jsonValue, setJsonValue ] =  useState<string>('');
  const intl = useIntl();

  const {
    disabled,
    total,
    returnType,
    item: {
      value, 
      name, 
      description, 
      index,
      id,
    },
    prefix,
    handleInput,
    handleDelete,
    handleChangeVariation,
    hooksFormContainer,
  } = props;

  const {
    formState: { errors },
    register,
    unregister,
    setValue,
    trigger,
  } = hooksFormContainer.useContainer();

  useEffect(() => {
    register(`variation_${id}_name`, {
      required: {
        value: true,
        message: intl.formatMessage({id: 'common.input.placeholder'})
      }
    });

    if (returnType !== 'boolean') {
      register(`variation_${id}`, {
        required: {
          value: true,
          message: intl.formatMessage({id: 'common.input.placeholder'})
        },
        validate: {
          isNumber: (v: string) => {
            const reg = /^(-?\d+)(\.\d+)?$/i;
            if (v && returnType === 'number' && !reg.test(v)) {
              return intl.formatMessage({id: 'common.number.invalid'});
            }
            return true;
          },
          isJSON: (v: string) => {
            if (v && returnType === 'json' && !isJSON(v)) {
              return intl.formatMessage({id: 'common.json.invalid'});
            }
            return true;
          }
        }
      });

    } else {
      unregister(`variation_${id}`);
      register(`variation_${id}_normal`, {
        required: {
          value: true,
          message: intl.formatMessage({id: 'common.input.placeholder'})
        },
      });
      setValue(`variation_${id}_normal`, value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, returnType, register, unregister, setValue, value]);

  const handleChange = useCallback(value => {
    setJsonValue(value);
    if (!isJSON(value)) {
      setCanSave(false);
    } else {
      setCanSave(true);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    handleChangeVariation(index, jsonValue);
    setValue(`variation_${id}`, jsonValue);
    setOpen(false);
    await trigger(`variation_${id}`);
  }, [index, id, jsonValue, trigger, setValue, handleChangeVariation]);

  const handleCancel = useCallback(() => {
    setCanSave(true);
    setOpen(false);
  }, []);

  const handleChangeBoolean = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    handleChangeVariation(index, detail.value as string);
  }, [index, handleChangeVariation]);

  const modalContentCls = classNames(
    styles['modal-content'], 
    {
      [styles['modal-content-error']]: !canSave
    }
  );

  const booleanOption = useMemo(() => {
    return[
      { 
        key: 'true', 
        value: 'true', 
        text: intl.formatMessage({id: 'common.true.text'}) 
      },
      { 
        key: 'false', 
        value: 'false', 
        text: intl.formatMessage({id: 'common.false.text'}) 
      },
    ];
  }, [intl]);

	return (
    <div className={styles.line}>
      <div className={styles.name}>
        <span className={styles['name-color']} style={{background: VariationColors[index % 20]}}></span>
      </div>
      <div className={styles.left}>
        <Form.Group widths='equal'>
          <Form.Field className={styles[`${ prefix ? (prefix + '-') : '' }variation-name`]}>
            <Form.Input 
              fluid 
              customname='name'
              value={name}
              index={index}
              placeholder={intl.formatMessage({id: 'common.name.lowercase.text'})}
              disabled={disabled}
              name={`variation_${id}_name`}
              label={(
                <span className={styles['label-text']}>
                  <span className={styles['label-required']}>*</span>
                  <FormattedMessage id='common.name.lowercase.text' />
                </span>
              )}
              error={errors?.[`variation_${id}_name`] ? true : false}
              onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                handleInput(e, detail);
                setValue(detail.name, detail.value);
                await trigger(`variation_${id}_name`);
              }}
            />
            { 
              errors[`variation_${id}_name`] && <div className={prefix ? 'error-text-transform' : 'error-text-normal'}>
                { errors[`variation_${id}_name`].message }
              </div> 
            }
          </Form.Field>
          <Form.Field className={styles[`${prefix ? (prefix + '-') : ''}variation-value`]}>
            {
              returnType !== 'boolean' ? (
                <Form.Input 
                  fluid 
                  value={value}
                  customname='value'
                  index={index}
                  name={`variation_${id}`}
                  label={(
                    <span className={styles['label-text']}>
                      <span className={styles['label-required']}>*</span>
                      <FormattedMessage id='common.value.text' />
                    </span>
                  )}
                  placeholder={intl.formatMessage({id: 'common.value.text'})}
                  error={errors?.[`variation_${id}`] ? true : false}
                  disabled={disabled}
                  onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                    handleInput(e, detail);
                    setValue(detail.name, detail.value);
                    await trigger(`variation_${id}`);
                  }}
                  icon={
                    returnType === 'json' && (
                      <Icon customclass={styles['icon-evaluate']} type='code' onClick={() => setOpen(true)} />
                    )
                  }
                />
              ) : (
                <Form.Dropdown 
                  fluid 
                  selection 
                  floating
                  value={value}
                  customname='value'
                  name={`variation_${id}_normal`}
                  className={styles['status-dropdown']}
                  selectOnBlur={false}
                  options={booleanOption} 
                  label={(
                    <span className={styles['label-text']}>
                      <span className={styles['label-required']}>*</span>
                      <FormattedMessage id='common.value.text' />
                    </span>
                  )}
                  disabled={disabled}
                  placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                  icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                  error={errors[`variation_${id}_normal`] ? true : false}
                  onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                    handleChangeBoolean(e, detail);
                    setValue(detail.name, detail.value);
                    await trigger(`variation_${id}_normal`);
                  }}
                />
              )
            }
            { 
              errors[`variation_${id}`] && <div className={prefix ? 'error-text-transform' : 'error-text-normal'}>
                { errors[`variation_${id}`].message }
              </div> 
            }
          </Form.Field>
          <Form.Field width={6}>
            <Form.Input 
              fluid 
              index={index}
              value={description} 
              name='description'
              customname='description'
              placeholder={intl.formatMessage({id: 'common.description.lowercase.text'})}
              onChange={handleInput}
              disabled={disabled}
              label={(
                <span className={styles.label}>
                  <FormattedMessage id='common.description.lowercase.text' />
                </span>
              )}
            />
          </Form.Field>
        </Form.Group>
      </div>
      {
        index !== 0 && total !== 2 && !disabled ? (
          <div className={styles.operation}>
            <Icon customclass={styles.iconfont} type='minus' onClick={() => handleDelete(index)} />
          </div>
          ) : (
          <div className={styles['operation-holder']}></div>
        )
      }

      <Modal 
        open={open}
        confirmDisabled={!canSave}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      >
        <div>
          <div className={styles['modal-header']}>
            <span>
              <FormattedMessage id='common.value.text' />
            </span>
            <Icon customclass={styles['modal-header-icon']} type='close' onClick={handleCancel} />
          </div>
          <div className={modalContentCls}>
            <JsonEditor 
              value={value}
              onChange={handleChange}
            />
            { 
              !canSave && <div className={prefix ? 'error-text-transform' : 'error-text-normal'}>
                <FormattedMessage id='common.json.invalid' />
              </div> 
            }
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default VariationItem;