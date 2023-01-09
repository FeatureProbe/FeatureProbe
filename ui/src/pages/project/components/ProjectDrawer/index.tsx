import { SyntheticEvent, useEffect, useCallback, useState, useMemo } from 'react';
import { 
  Form,
  InputOnChangeData,
  TextAreaProps,
} from 'semantic-ui-react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import { addProject, checkProjectExist, editProject } from 'services/project';
import { projectContainer, hooksFormContainer } from '../../provider';
import { replaceSpace } from 'utils/tools';
import { CONFLICT } from 'constants/httpCode';
import { useRequestTimeCheck } from 'hooks';

import styles from './index.module.scss';

interface IProps {
  isAdd: boolean;
  visible: boolean;
  projectKey: string;
  setDrawerVisible(visible: boolean): void;
  refreshProjectsList(): void;
}

const ProjectDrawer = (props: IProps) => {
  const { isAdd, visible, projectKey, setDrawerVisible, refreshProjectsList } = props;
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
    projectInfo,
    originProjectInfo,
    handleChange,
    saveProjectInfo,
    saveOriginProjectInfo,
  } = projectContainer.useContainer();

  const drawerCls = classNames(
    styles['project-drawer'], {
      [styles['project-drawer-inactive']]: visible
    }
  );

  const formCls = classNames(
    styles['project-drawer-form'], {
      [styles['project-drawer-form-inactive']]: visible
    }
  );

  useEffect(() => {
    if (visible) {
      saveKeyEdit(false);
      clearErrors();
    } else {
      saveProjectInfo({
        key: '',
        name: '',
        description: ''
      });
      saveOriginProjectInfo({
        key: '',
        name: '',
        description: ''
      });
    }
  }, [visible, clearErrors, saveProjectInfo, saveOriginProjectInfo]);

  useEffect(() => {
    setValue('name', projectInfo.name);
    setValue('key', projectInfo.key);
  }, [projectInfo, setValue]);

  const creatRequestTimeCheck = useRequestTimeCheck();

  const debounceNameExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('name');
      const res = await checkProjectExist({
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
  }, [creatRequestTimeCheck, setError]);

  const debounceKeyExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('key');
      const res = await checkProjectExist({
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
  }, [creatRequestTimeCheck, setError]);

  const checkNameExist = useCallback(async (type: string, value: string) => {
    await debounceNameExist(type, value);
  }, [debounceNameExist]);

  const checkKeyExist = useCallback(async (type: string, value: string) => {
    await debounceKeyExist(type, value);
  }, [debounceKeyExist]);

  const onSubmit = useCallback(async () => {
    let res;
    setSubmitLoading(true);
    const params = replaceSpace(cloneDeep(projectInfo));
    if (params.name === '') {
      setError('name', {
        message: intl.formatMessage({id: 'projects.name.required'}),
      });
      return;
    }

    if (isAdd) {
      res = await addProject(params);
    } else {
      res = await editProject(projectKey, params);
    }
    setSubmitLoading(false);

    if (res.success) {
      message.success(isAdd 
        ? intl.formatMessage({id: 'projects.create.success'}) 
        : intl.formatMessage({id: 'projects.edit.success'})
      );
      refreshProjectsList();
      setDrawerVisible(false);
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message,
        });
        return;
      }
      message.error(isAdd 
        ? intl.formatMessage({id: 'projects.create.error'}) 
        : intl.formatMessage({id: 'projects.edit.error'})
      );
    }
  }, [isAdd, projectInfo, projectKey, setError, intl, setDrawerVisible, refreshProjectsList]);

	return (
    <div className={drawerCls}>
      <Form 
        className={formCls}
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)} 
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? intl.formatMessage({id: 'projects.create.project'}) : intl.formatMessage({id: 'projects.edit.project'}) }
          </div>
          <Button loading={submitLoading} size='mini' primary type='submit' disabled={!!errors.name || !!errors.key || submitLoading}>
            {
              isAdd ? intl.formatMessage({id: 'common.create.text'}) : intl.formatMessage({id: 'common.save.text'})
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customclass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['project-drawer-form-content']}>
          <FormItemName
            className={styles.formItem}
            value={projectInfo?.name}
            errors={errors}
            register={register}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (detail.value.length > 50 ) return;
              if (detail.value !== originProjectInfo.name) {
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
            value={projectInfo?.key}
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
            value={projectInfo?.description}
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

export default ProjectDrawer;
