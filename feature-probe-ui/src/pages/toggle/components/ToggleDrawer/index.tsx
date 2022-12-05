import { SyntheticEvent, FormEvent, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Form,
  Popup,
  Dropdown,
  Select,
  DropdownProps,
  InputOnChangeData,
  TextAreaProps,
  CheckboxProps,
  DropdownItemProps,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { FormattedMessage, useIntl } from 'react-intl';
import Joyride, { CallBackProps, EVENTS, Step, ACTIONS } from 'react-joyride';
import { debounce } from 'lodash';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Variations from 'components/Variations';
import Icon from 'components/Icon';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import { variationContainer, toggleInfoContainer, hooksFormContainer } from '../../provider';
import { VariationColors } from 'constants/colors';
import { CONFLICT } from 'constants/httpCode';
import { replaceSpace } from 'utils/tools';
import { initVariations, initBooleanVariations, returnTypeOptions } from './constants';
import { IDictionary, IVariation } from 'interfaces/targeting';
import { ITag, ITagOption } from 'interfaces/project';
import { createToggle, getTags, addTag, editToggle, checkToggleExist } from 'services/toggle';
import { saveDictionary, getFromDictionary } from 'services/dictionary';

import { useFormErrorScrollIntoView, useRequestTimeCheck } from 'hooks';
import { commonConfig, floaterStyle, tourStyle } from 'constants/tourConfig';
import { USER_GUIDE_TOGGLE } from 'constants/dictionary_keys';
import styles from './index.module.scss';

interface IParams {
  isAdd: boolean;
  visible: boolean;
  environmentKey?: string;
  setDrawerVisible: (visible: boolean) => void;
  refreshToggleList: () => void
}

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

const STEPS: Step[] = [
  {
    content: (
      <div>
        <div className='joyride-title'>
          <FormattedMessage id='guide.creat.toggle.step1.title' />
        </div>
        <ul className='joyride-item'>
          <li><FormattedMessage id='guide.creat.toggle.step1.sdk1' /></li>
        </ul>
        <div className='joyride-pagination'>1/3</div>
      </div>
    ),
    placement: 'left',
    target: '.joyride-sdk-type',
    spotlightPadding: 10,
    ...commonConfig
  },
  {
    content: (
      <div>
        <div className='joyride-title'>
          <FormattedMessage id='guide.creat.toggle.step2.title' />
        </div>
        <ul className='joyride-item'>
          <li>
            <FormattedMessage id='guide.creat.toggle.step2.type1' />
          </li>
          <li>
            <FormattedMessage id='guide.creat.toggle.step2.type2' />
          </li>
        </ul>
        <div className='joyride-pagination'>2/3</div>
      </div>
    ),
    placement: 'left',
    spotlightPadding: 10,
    target: '.joyride-return-type',
    ...commonConfig
  },
  {
    content: (
      <div>
        <div className='joyride-title'>
          <FormattedMessage id='guide.creat.toggle.step3.title' />
        </div>
        <ul className='joyride-item'>
          <li>
            <FormattedMessage id='guide.creat.toggle.step3.type'/>
          </li>
        </ul>
        <div className='joyride-pagination'>3/3</div>
      </div>
    ),
    placement: 'left',
    spotlightPadding: 10,
    target: '.joyride-disabled-return-value',
    ...commonConfig
  },
];

const Drawer = (props: IParams) => {
  const { isAdd, visible, setDrawerVisible, refreshToggleList } = props;
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
    getValues,
  } = hooksFormContainer.useContainer();

  const { projectKey } = useParams<ILocationParams>();
  const { variations, saveVariations } = variationContainer.useContainer();
  const [ tagsOptions, saveTagsOptions ] = useState<ITagOption[]>([]);
  const [ run, saveRun ] = useState<boolean>(false);
  const [ isKeyEdit, saveKeyEdit ] = useState<boolean>(false);
  const [ stepIndex, saveStepIndex ] = useState<number>(0);
  const [ submitLoading, setSubmitLoading ] = useState<boolean>(false);
  const intl = useIntl();
  const { scrollToError } = useFormErrorScrollIntoView(errors);

  const { 
    toggleInfo, 
    originToggleInfo, 
    handleChange, 
    saveToggleInfo, 
    saveOriginToggleInfo,
  } = toggleInfoContainer.useContainer();

  const options = variations?.map((item: IVariation, index: number) => {
    const text = item.name || item.value || `variation ${index + 1}`;
    return {
      text,
      value: index,
      content: (
        <div>
          <span style={{ background: VariationColors[index % 20] }} className={styles['variation-name-color']}></span>
          <span>{ text }</span>
        </div>
      ),
    };
  });

  const getTagList = useCallback(async () => {
    const res = await getTags<ITag[]>(projectKey);
    const { success, data } = res;
    if (success && data) {
      const tags = data.map((item: ITag) => {
        return {
          key: item.name,
          text: item.name,
          value: item.name,
        };
      });
      saveTagsOptions(tags);
    } else {
      message.error(intl.formatMessage({id: 'tags.list.error'}));
    }
  }, [intl, projectKey]);

  const getUserGuide = useCallback(() => {
    getFromDictionary<IDictionary>(USER_GUIDE_TOGGLE).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        if (parseInt(savedData) !== STEPS.length) {
          setTimeout(() => {
            saveRun(true);
          }, 500);
          saveStepIndex(parseInt(savedData));
        }
      } else {
        setTimeout(() => {
          saveRun(true);
        }, 500);
      }
    });
  }, []);

  useEffect(() => {
    if (visible) {
      clearErrors();
      getTagList();
      saveKeyEdit(false);
      if (isAdd) {
        getUserGuide();
      }
    } else {
      saveToggleInfo({
        name: '',
        key: '',
        desc: '',
        tags: [],
        clientAvailability: false,
        returnType: 'boolean',
        disabledServe: 0,
        permanent: false,
      });
      saveOriginToggleInfo({
        name: '',
        key: '',
        desc: '',
        tags: [],
        clientAvailability: false,
        returnType: 'boolean',
        disabledServe: 0,
        permanent: false,
      });
    }
  }, [visible, isAdd, clearErrors, getTagList, saveToggleInfo, saveOriginToggleInfo, getUserGuide]);

  useEffect(() => {
    setValue('name', toggleInfo.name);
    setValue('key', toggleInfo.key);
    setValue('returnType', toggleInfo.returnType);

    if (toggleInfo.disabledServe < variations.length) {
      setValue('disabledServe', toggleInfo.disabledServe);
      clearErrors('disabledServe');
    } else {
      setError('disabledServe', {
        message: intl.formatMessage({id: 'targeting.disabled.return.value.required'})
      });
      setValue('disabledServe', null);
    }

    variations.forEach((variation: IVariation) => {
      setValue(`variation_${variation.id}_name`, variation.name);
      setValue(`variation_${variation.id}`, variation.value);
    });

  }, [intl, toggleInfo, variations, setValue, setError, clearErrors]);

  useEffect(() => {
    if (isAdd) {
      if (toggleInfo.returnType === 'boolean') {
        saveVariations(cloneDeep(initBooleanVariations));
      } else {
        saveVariations(cloneDeep(initVariations));
      }
    }
  }, [isAdd, toggleInfo.returnType, saveVariations]);

  useEffect(() => {
    register('returnType', { 
      required: true, 
    });

    register('disabledServe', { 
      required: true, 
    });
  }, [register]);

  const onSubmit = useCallback(async () => {
    setSubmitLoading(true);
    let res;
    const params = replaceSpace(cloneDeep(toggleInfo));
    const clonevariations = cloneDeep(variations);
    clonevariations.forEach((variation: IVariation) => {
      delete variation.id;
    });

    if (isAdd) {
      res = await createToggle(projectKey, {
        variations: clonevariations,
        ...params
      });
    } else {
      res = await editToggle(projectKey, toggleInfo.key, {
        variations: clonevariations,
        ...params
      });
    }
    setSubmitLoading(false);

    if (res.success) {
      message.success(
        isAdd ? intl.formatMessage({id: 'toggles.create.success'}) : intl.formatMessage({id: 'toggles.edit.success'})
      );
      setDrawerVisible(false);
      refreshToggleList();
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message
        });
        return;
      }
      message.error(
        isAdd ? intl.formatMessage({id: 'toggles.create.error'}) : intl.formatMessage({id: 'toggles.edit.error'})
      );
    }
  }, [intl, isAdd, projectKey, refreshToggleList, setDrawerVisible, setError, toggleInfo, variations]);

  const onError = () => {
    scrollToError();
  };

  const handleAddTag = useCallback(async (e: SyntheticEvent, detail: DropdownProps) => {
    const res = await addTag(projectKey, {
      name: detail.value?.toString() || '',
    });
    
    if (res.success) {
      getTagList();
    } else {
      message.error(intl.formatMessage({id: 'tags.add.error'}));
    }
  }, [intl, projectKey, getTagList]);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customclass={styles['dropdown-remove-icon']} type='close' />,
    });
  }, []);

  const clearVariationErrors = useCallback(() => {
   for(const key in getValues()) {
      if (key.startsWith('variation_')) {
        clearErrors(key);
      }
    }
  }, [getValues, clearErrors]);

  const creatRequestTimeCheck = useRequestTimeCheck();
  
  const debounceNameExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('name');
      const res = await checkToggleExist(projectKey, {
        type,
        value
      });

      if(!check()) {
        return;
      }

      if (res.code === CONFLICT) {
        setError(type.toLocaleLowerCase(), {
          message: res.message,
        });
      }

    }, 500);
  }, [creatRequestTimeCheck, projectKey, setError]);

  const debounceKeyExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('key');
      const res = await checkToggleExist(projectKey, {
        type,
        value
      });

      if(!check()) {
        return;
      }

      if (res.code === CONFLICT) {
        setError(type.toLocaleLowerCase(), {
          message: res.message,
        });
      }
    }, 500);
  }, [creatRequestTimeCheck, projectKey, setError]);

  const checkNameExist = useCallback(async (type: string, value: string) => {
    await debounceNameExist(type, value);
  }, [debounceNameExist]);

  const checkKeyExist = useCallback(async (type: string, value: string) => {
    await debounceKeyExist(type, value);
  }, [debounceKeyExist]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      saveStepIndex(nextStepIndex);
      saveDictionary(USER_GUIDE_TOGGLE, nextStepIndex);
    }
  };

	return (
    <div className={`${styles['toggle-drawer']} ${visible && styles['toggle-drawer-inactive']}`}>
      <Form 
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit, onError)} 
        className={`${styles['toggle-drawer-form']} ${visible && styles['toggle-drawer-form-inactive']}`}
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? <FormattedMessage id='toggles.create.toggle' /> : <FormattedMessage id='toggles.edit.toggle' /> }
          </div>
          <Button loading={submitLoading} size='mini' primary type='submit' disabled={Object.keys(errors).length !== 0 || submitLoading}>
            {
              isAdd ? <FormattedMessage id='toggles.create.text' /> : <FormattedMessage id='common.save.text' />
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customclass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['toggle-drawer-form-content']}>
          {/* Toggle Name */}
          <FormItemName
            className={styles.input}
            value={toggleInfo?.name}
            errors={errors}
            register={register}
            size='mini'
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (detail.value.length > 50 ) return;
              if (detail.value !== originToggleInfo.name) {
                checkNameExist('NAME', detail.value);
              }
              handleChange(e, detail, 'name');
              setValue(detail.name, detail.value);
              await trigger('name');

              if (isKeyEdit || !isAdd) {
                return;
              }

              const reg = /[^A-Z0-9._-]+/gi;
              const keyValue = detail.value.replace(reg, '_');
              handleChange(e, {...detail, value: keyValue}, 'key');
              checkKeyExist('KEY', keyValue);
              setValue('key', keyValue);
              await trigger('key');
            }}
          />

          {/* Toggle Key */}
          <FormItemKey
            size='mini'
            className={styles.input}
            value={toggleInfo?.key}
            errors={errors}
            disabled={!isAdd}
            register={register}
            showPopup={true}
            popupText={intl.formatMessage({id: 'toggles.key.tips'})}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              saveKeyEdit(true);
              checkKeyExist('KEY', detail.value);
              handleChange(e, detail, 'key');
              setValue(detail.name, detail.value);
              await trigger('key');
            }}
          />

          {/* Toggle Description */}
          <FormItemDescription
            size='mini'
            className={styles.input}
            value={toggleInfo?.desc}
            disabled={!isAdd}
            onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
              if (('' + detail.value).length > 500 ) return;
              handleChange(e, detail, 'desc');
              setValue(detail.name, detail.value);
              await trigger('desc');
            }}
          />

          {/* Toggle Tags */}
          <Form.Field>
            <label>
              <FormattedMessage id='common.tags.text' />
            </label>
            <Dropdown
              fluid
              search
              multiple
              selection
              floating
              allowAdditions
              size='mini'
              className={`${styles['dropdown']} ${styles['input']}`}
              placeholder={intl.formatMessage({id: 'common.tags.placeholder'})}
              options={tagsOptions}
              value={toggleInfo?.tags}
              icon={
                <Icon customclass={styles['angle-down']} type='angle-down' />
              }
              onAddItem={handleAddTag}
              onChange={(e: SyntheticEvent, detail: DropdownProps) => handleChange(e, detail, 'tags')}
              renderLabel={renderLabel}
            />
          </Form.Field>

          {/* Toggle SDK Type */}
          <Form.Field className={`${styles.joyride} joyride-sdk-type`}>
            <label>
              <FormattedMessage id='toggles.sdk.type' />
            </label>
            <div className={styles['radio-group']}>
              <Form.Radio
                name='yes'
                label={intl.formatMessage({id: 'toggles.sdk.yes'})}
                className={styles['radio-group-item']}
                checked={!!toggleInfo?.clientAvailability}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'clientAvailability')} 
              />
              <Form.Radio 
                name='no'
                label={intl.formatMessage({id: 'toggles.sdk.no'})}
                className={styles['radio-group-item']}
                checked={!toggleInfo?.clientAvailability}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'clientAvailability')} 
              />
            </div>
          </Form.Field>
          
          {/* Toggle Return Type */}
          <Form.Field className={`${styles.joyride} joyride-return-type`}>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='toggles.returntype' />
              <Popup
                inverted
                trigger={
                  <Icon customclass={styles['icon-question']} type='question' />
                }
                content={intl.formatMessage({id: 'toggles.returntype.tips'})}
                position='top center'
                className='popup-override'
              />
            </label>
            <Select 
              floating
              name='returnType'
              placeholder={intl.formatMessage({id: 'toggles.returntype.placeholder'})}
              className={styles['dropdown']}
              disabled={!isAdd}
              error={ errors.returnType ? true : false }
              onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                clearVariationErrors();
                handleChange(e, detail, 'returnType');
                setValue(detail.name, detail.value);
                await trigger('returnType');
              }}
              value={toggleInfo?.returnType}
              options={returnTypeOptions} 
              icon={
                <Icon customclass={styles['angle-down']} type='angle-down' />
              }
            />
          </Form.Field>
          { 
            errors.returnType && (
              <div className={styles['error-text']}>
                <FormattedMessage id='toggles.returntype.errortext' />
              </div> 
            )
          }

          {/* Toggle Variations */}
          <Form.Field>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='common.variations.text' />
              <Popup
                inverted
                trigger={
                  <Icon customclass={styles['icon-question']} type='question' />
                }
                content={intl.formatMessage({id: 'toggles.variations.tips'})}
                position='top center'
                className='popup-override'
              />
            </label>
            <Variations
              prefix='drawer'
              returnType={toggleInfo?.returnType}
              variationContainer={variationContainer}
              hooksFormContainer={hooksFormContainer}
            />
          </Form.Field>

          {/* Toggle Disabled Return Value */}
          <Form.Field className={`${styles.joyride} joyride-disabled-return-value`}>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='common.disabled.return.type.text' />
              <Popup
                inverted
                trigger={<Icon customclass={styles['icon-question']} type='question' />}
                content={intl.formatMessage({id: 'toggles.disabled.return.type.tips'})}
                position='top center'
                className='popup-override'
              />
            </label>
            <Dropdown
              floating
              selection
              name='disabledServe'
              value={toggleInfo?.disabledServe}
              error={ errors.disabledServe ? true : false }
              onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                handleChange(e, detail, 'disabledServe');
                setValue(detail.name, detail.value);
                await trigger('disabledServe');
              }}
              className={styles['dropdown']}
              options={options} 
              placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})}
              icon={
                <Icon customclass={styles['angle-down']} type='angle-down' />
              }
            />
          </Form.Field>

          {/* Toggle Permanent */}
          <Form.Field>
            <label>
              <FormattedMessage id='toggles.permanent.type' />
              <Popup
                inverted
                trigger={<Icon customclass={styles['icon-question']} type='question' />}
                content={intl.formatMessage({id: 'toggles.permanent.type.tips'})}
                position='top center'
                className='popup-override'
                wide={true}
              />
            </label>
            <div className={styles['radio-group']}>
              <Form.Radio
                name='permanent-yes'
                label={intl.formatMessage({id: 'common.yes.text'})}
                className={styles['radio-group-item']}
                checked={!!toggleInfo.permanent}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'permanent')} 
              />
              <Form.Radio 
                name='permanent-no'
                label={intl.formatMessage({id: 'common.no.text'})}
                className={styles['radio-group-item']}
                checked={!toggleInfo.permanent}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'permanent')} 
              />
            </div>
          </Form.Field>
          { 
            errors.disabledServe && (
              <div className={styles['error-text']}>
                <FormattedMessage id='toggles.disabled.return.type.errortext' />
              </div> 
            )
          }
        </div>
      </Form>
      <Joyride
        run={run}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress={false}
        showSkipButton
        steps={STEPS}
        disableCloseOnEsc={true}
        locale={{
          'back': intl.formatMessage({id: 'guide.last'}),
          'next': intl.formatMessage({id: 'guide.next'}),
          'last': intl.formatMessage({id: 'guide.done'}),
        }}
        floaterProps={{...floaterStyle}}
        styles={{...tourStyle}}
      />
    </div>
	);
};

export default Drawer;