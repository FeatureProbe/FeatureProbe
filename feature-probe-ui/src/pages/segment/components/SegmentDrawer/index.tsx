import { SyntheticEvent, useEffect, useCallback, useState, useMemo } from 'react';
import { 
  Form,
  InputOnChangeData,
  TextAreaProps,
} from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import { useRequestTimeCheck } from 'hooks';
import { checkSegmentExist, editSegment, addSegment } from 'services/segment';
import { segmentContainer, hooksFormContainer } from '../../provider';
import { replaceSpace } from 'utils/tools';
import { CONFLICT } from 'constants/httpCode';

import styles from './index.module.scss';

interface IProps {
  isAdd: boolean;
  visible: boolean;
  segmentKey: string;
  projectKey: string;
  setDrawerVisible(visible: boolean): void;
  refreshSegmentsList(): void;
}

const SegmentDrawer = (props: IProps) => {
  const { isAdd, visible, segmentKey, setDrawerVisible, refreshSegmentsList, projectKey } = props;
  const [ isKeyEdit, saveKeyEdit ] = useState<boolean>(false);
  const [ submitLoading, setSubmitLoading ] = useState<boolean>(false);
  const intl = useIntl();
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const { 
    segmentInfo,
    originSegmentInfo,
    handleChange,
    saveSegmentInfo,
    saveOriginSegmentInfo,
  } = segmentContainer.useContainer();

  const drawerCls = classNames(
    styles['segment-drawer'], {
      [styles['segment-drawer-inactive']]: visible
    }
  );

  const formCls = classNames(
    styles['segment-drawer-form'], {
      [styles['segment-drawer-form-inactive']]: visible
    }
  );

  useEffect(() => {
    if (visible) {
      saveKeyEdit(false);
      clearErrors();
    } else {
      saveSegmentInfo({
        key: '',
        name: '',
        description: ''
      });
      saveOriginSegmentInfo({
        key: '',
        name: '',
        description: ''
      });
    }
  }, [visible, clearErrors, saveSegmentInfo, saveOriginSegmentInfo]);

  useEffect(() => {
    setValue('name', segmentInfo.name);
    setValue('key', segmentInfo.key);
  }, [segmentInfo, setValue]);

  const creatRequestTimeCheck = useRequestTimeCheck();

  const debounceNameExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('name');
      const res = await checkSegmentExist(projectKey, {
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
  }, [creatRequestTimeCheck, setError, projectKey]);

  const debounceKeyExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('key');
      const res = await checkSegmentExist(projectKey, {
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
  }, [creatRequestTimeCheck, setError, projectKey]);

  const checkNameExist = useCallback(async (type: string, value: string) => {
    await debounceNameExist(type, value);
  }, [debounceNameExist]);

  const checkKeyExist = useCallback(async (type: string, value: string) => {
    await debounceKeyExist(type, value);
  }, [debounceKeyExist]);

  const onSubmit = useCallback(async () => {
    let res;
    setSubmitLoading(true);
    const params = replaceSpace(cloneDeep(segmentInfo));
    if (params.name === '') {
      setError('name', {
        message: intl.formatMessage({id: 'segments.name.required'}),
      });
      return;
    }

    if (isAdd) {
      res = await addSegment(projectKey, params);
    } else {
      res = await editSegment(projectKey, segmentKey, params);
    }
    setSubmitLoading(false);

    if (res.success) {
      message.success(isAdd 
        ? intl.formatMessage({id: 'segments.create.success'}) 
        : intl.formatMessage({id: 'segments.edit.success'})
      );
      refreshSegmentsList();
      setDrawerVisible(false);
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message,
        });
        return;
      }
      message.error(isAdd 
        ? intl.formatMessage({id: 'segments.create.error'}) 
        : intl.formatMessage({id: 'segments.edit.error'})
      );
    }
  }, [segmentInfo, isAdd, setError, intl, projectKey, segmentKey, refreshSegmentsList, setDrawerVisible]);

	return (
    <div className={drawerCls}>
      <Form 
        className={formCls}
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)} 
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? intl.formatMessage({id: 'segments.create.text'}) : intl.formatMessage({id: 'segments.edit.text'}) }
          </div>
          <Button loading={submitLoading} size='mini' primary type='submit' disabled={!!errors.name || !!errors.key || submitLoading}>
            {
              isAdd ? intl.formatMessage({id: 'segments.create.publish.text'}) : intl.formatMessage({id: 'common.save.text'})
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customclass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['segment-drawer-form-content']}>
          <FormItemName
            className={styles.formItem}
            value={segmentInfo?.name}
            errors={errors}
            register={register}
            labelRender={<FormattedMessage id='segments.label.name.text' />}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (detail.value.length > 50 ) return;
              if (detail.value !== originSegmentInfo.name) {
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

          <FormItemKey
            className={styles.formItem}
            value={segmentInfo?.key}
            errors={errors}
            disabled={!isAdd}
            register={register}
            showPopup={false}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              saveKeyEdit(true);
              checkKeyExist('KEY', detail.value);
              handleChange(e, detail, 'key');
              setValue(detail.name, detail.value);
              await trigger('key');
            }}
          />

          <FormItemDescription
            className={styles.formItem}
            value={segmentInfo?.description}
            disabled={!isAdd}
            onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
              if (('' + detail.value).length > 500 ) return;
              handleChange(e, detail, 'description');
              setValue(detail.name, detail.value);
              await trigger('description');
            }}
          />
        </div>
      </Form>
    </div>
	);
};

export default SegmentDrawer;
