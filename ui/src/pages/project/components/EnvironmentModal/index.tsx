import { useCallback, SyntheticEvent, useEffect, useState, useMemo } from 'react';
import { DropdownProps, Form, InputOnChangeData, Select } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';
import { FormattedMessage, useIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Button';
import message from 'components/MessageBox';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import { hooksFormContainer, environmentContainer } from '../../provider';
import { addEnvironment, editEnvironment } from 'services/project';
import { checkEnvironmentExist } from 'services/toggle';
import { CONFLICT } from 'constants/httpCode';
import { replaceSpace } from 'utils/tools';
import { useRequestTimeCheck } from 'hooks';
import { IEnvironment } from 'interfaces/project';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  isAdd: boolean;
  projectKey: string;
  environments?: IEnvironment[];
  handleCancel(): void;
  handleConfirm(): void;
}

const EnvironmentModal = (props: IProps) => {
  const { open, isAdd, projectKey, environments, handleCancel, handleConfirm } = props;
  const [isKeyEdit, saveKeyEdit] = useState<boolean>(false);
  const intl = useIntl();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const {
    formState: { errors },
    register,
    unregister,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const { environmentInfo, originEnvironmentInfo, handleChange, saveEnvironmentInfo, saveOriginEnvironmentInfo } =
    environmentContainer.useContainer();

  useEffect(() => {
    if (open) {
      saveKeyEdit(false);
      clearErrors();
    } else {
      saveEnvironmentInfo({
        key: '',
        name: '',
        copy: ''
      });
      saveOriginEnvironmentInfo({
        key: '',
        name: '',
        copy: ''
      });
    }
  }, [open, clearErrors, saveEnvironmentInfo, saveOriginEnvironmentInfo]);

  useEffect(() => {
    setValue('name', environmentInfo.name);
    setValue('key', environmentInfo.key);
  }, [environmentInfo, setValue]);

  useEffect(() => {
    if (open && isAdd) {
      register('copyEnv', {
        required: true,
      });
    } else {
      unregister('copyEnv');
    }
  }, [register, open, clearErrors, unregister, isAdd]);

  const creatRequestTimeCheck = useRequestTimeCheck();

  const debounceNameExist = useMemo(() => {
    return debounce(async (type: string, value: string) => {
      const check = creatRequestTimeCheck('name');
      const res = await checkEnvironmentExist(projectKey, {
        type,
        value,
      });

      if (!check()) {
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
    return debounce(async (type: string, value: string) => {
      const check = creatRequestTimeCheck('key');
      const res = await checkEnvironmentExist(projectKey, {
        type,
        value,
      });

      if (!check()) {
        return;
      }

      if (res.code === CONFLICT) {
        setError(type.toLocaleLowerCase(), {
          message: res.message,
        });
      }
    }, 500);
  }, [creatRequestTimeCheck, projectKey, setError]);

  const checkNameExist = useCallback(
    async (type: string, value: string) => {
      await debounceNameExist(type, value);
    },
    [debounceNameExist]
  );

  const checkKeyExist = useCallback(
    async (type: string, value: string) => {
      await debounceKeyExist(type, value);
    },
    [debounceKeyExist]
  );

  const onSubmit = useCallback(async () => {
    let res;
    setSubmitLoading(true);

    const params = replaceSpace(cloneDeep(environmentInfo));
    if (params.name === '') {
      setError('name', {
        message: intl.formatMessage({ id: 'projects.environment.name.required' }),
      });
      return;
    }

    if (isAdd) {
      res = await addEnvironment(projectKey, params);
    } else {
      res = await editEnvironment(projectKey, environmentInfo.key, params);
    }
    setSubmitLoading(false);

    if (res.success) {
      message.success(
        isAdd
          ? intl.formatMessage({ id: 'projects.create.environment.success' })
          : intl.formatMessage({ id: 'projects.edit.environment.success' })
      );
      handleConfirm();
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message,
        });
        return;
      }
      message.error(
        isAdd
          ? intl.formatMessage({ id: 'projects.create.environment.error' })
          : intl.formatMessage({ id: 'projects.edit.environment.error' })
      );
    }
  }, [isAdd, intl, projectKey, setError, environmentInfo, handleConfirm]);

  return (
    <Modal
      open={open}
      width={480}
      footer={null}
      handleCancel={() => {
        clearErrors();
        handleCancel();
      }}
    >
      <div className={styles.modal}>
        <div className={styles['modal-header']}>
          <span className={styles['modal-header-text']}>
            {isAdd
              ? intl.formatMessage({ id: 'projects.create.environment' })
              : intl.formatMessage({ id: 'projects.edit.environment' })}
          </span>
          <Icon customclass={styles['modal-close-icon']} type="close" onClick={handleCancel} />
        </div>
        <div className={styles['modal-content']}>
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormItemName
              className={styles.field}
              value={environmentInfo?.name}
              errors={errors}
              register={register}
              onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                if (detail.value.length > 15) return;
                if (detail.value !== originEnvironmentInfo.name) {
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
                handleChange(e, { ...detail, value: keyValue }, 'key');
                checkKeyExist('KEY', keyValue);
                setValue('key', keyValue);
                await trigger('key');
              }}
            />

            <FormItemKey
              value={environmentInfo?.key}
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

            {isAdd && (
              <>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id="projects.environment.crete.copyEnvLabel" />
                  </label>
                  <Select
                    floating
                    name="copyEnv"
                    placeholder={intl.formatMessage({ id: 'projects.environment.crete.copyEnvPlaceholder' })}
                    className={styles['dropdown']}
                    disabled={!isAdd}
                    error={errors.copyEnv ? true : false}
                    onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                      handleChange(e, detail, 'copyEnv');
                      setValue(detail.name, detail.value);
                      await trigger('copyEnv');
                    }}
                    value={environmentInfo?.copyEnv}
                    options={
                      environments?.map((item) => {
                        return {
                          key: item.key,
                          value: item.key,
                          text: item.name,
                        };
                      }) ?? []
                    }
                    icon={<Icon customclass={styles['angle-down']} type="angle-down" />}
                  />
                </Form.Field>
                {errors.copyEnv && (
                  <div className={styles['error-text']}>
                    <FormattedMessage id="projects.environment.crete.copyEnvPlaceholder" />
                  </div>
                )}
                <div className={styles['tip-text']}>
                  <FormattedMessage id="projects.environment.crete.copyEnvTips" />
                </div>
              </>
            )}

            <div className={styles['footer']}>
              <Button
                size="mini"
                className={styles['btn']}
                type="reset"
                basic
                onClick={() => {
                  clearErrors();
                  handleCancel();
                }}
              >
                <FormattedMessage id="common.cancel.text" />
              </Button>
              <Button
                loading={submitLoading}
                size="mini"
                type="submit"
                primary
                disabled={!!errors.name || !!errors.key || submitLoading}
              >
                <FormattedMessage id="common.confirm.text" />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default EnvironmentModal;
