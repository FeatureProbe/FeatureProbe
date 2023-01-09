import { useCallback, SyntheticEvent, useEffect, useMemo } from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import UserSettingLayout from 'layout/userSettingLayout';
import SectionTitle from 'components/SectionTitle';
import Button from 'components/Button';
import message from 'components/MessageBox';
import { modifyPassword } from 'services/member';
import { INVALID_REQUEST } from 'constants/httpCode';
import { HeaderContainer } from 'layout/hooks';
import styles from './index.module.scss';

const Member = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    setError,
  } = useForm();

  const intl = useIntl();
  const { userInfo } = HeaderContainer.useContainer();

  const onSubmit = useCallback(async (data) => {
    const res = await modifyPassword({
      'oldPassword': data[OLD_PASSWORD],
      'newPassword': data[NEW_PASSWORD]
    });

    if (res.success) {
      message.success(intl.formatMessage({id: 'profile.password.update.success.text'}));
    } else if (res.code === INVALID_REQUEST) {
      setError(
        OLD_PASSWORD, 
        { 
          message: intl.formatMessage({
            id: 'profile.password.error.text'
          })
        }
      );
    } 
    else {
      message.error(intl.formatMessage({id: 'profile.password.update.error.text'}));
    }
  }, [intl, setError]);

  const PASSWORD_REGISTER = useMemo(() => {
    return {
      required: {
        value: true,
        message: intl.formatMessage({id: 'login.password.required'})
      },
      minLength: {
        value: 4,
        message: intl.formatMessage({id: 'login.password.minlength'})
      },
      maxLength: {
        value: 20,
        message: intl.formatMessage({id: 'login.password.maxlength'})
      },
      pattern: {
        value: /^[A-Z0-9._-]+$/i,
        message: intl.formatMessage({id: 'login.password.invalid'})
      }
    };
  }, [intl]);

  useEffect(() => {
    register(OLD_PASSWORD, PASSWORD_REGISTER);
    register(NEW_PASSWORD, PASSWORD_REGISTER);
    register(CONFIRM_NEW_PASSWORD, PASSWORD_REGISTER);
  }, [register, PASSWORD_REGISTER]);

  const OLD_PASSWORD = 'oldPassword';
  const NEW_PASSWORD = 'newPassword';
  const CONFIRM_NEW_PASSWORD = 'confirmNewPassword';
  const isDemo = localStorage.getItem('isDemo') === 'true';

	return (
    <UserSettingLayout>
      <div className={styles.profile}>
        <div className={styles.heading}>
          <FormattedMessage id='common.profile.text' />
        </div>
        <div className={styles.form}>
          <Form 
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)} 
          >
            <div className={styles.section}>
              <SectionTitle
                title={intl.formatMessage({id: 'profile.my.profile'})}
                showTooltip={false}
              />
              <Form.Field className={styles.field}>
                <label className={styles.label}>
                  <FormattedMessage id='common.account.text' />
                </label>
                <Form.Input
                  disabled={true}
                  value={userInfo?.account}
                />
              </Form.Field>
            </div>

            {
              isDemo ? (
                <div className={styles.section}>
                  <SectionTitle
                    title={intl.formatMessage({id: 'profile.change.password'})}
                    showTooltip={false}
                  />
                  <div className={styles['demo-tips']}>
                    <FormattedMessage id='login.demo.password.tip' />
                  </div> 
                </div>
              ) : (
                <>
                  <div className={styles.section}>
                    <SectionTitle
                      title={intl.formatMessage({id: 'profile.change.password'})}
                      showTooltip={false}
                    />
                    <Form.Field className={styles.field}>
                      <label className={styles.label}>
                        <FormattedMessage id='profile.password.current' />
                      </label>
                      <Form.Input
                        type='password'
                        name={OLD_PASSWORD}
                        placeholder={intl.formatMessage({id: 'login.password.required'})}
                        error={ errors[OLD_PASSWORD] ? true : false }
                        onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                          setValue(detail.name, detail.value);
                          await trigger(OLD_PASSWORD);
                        }}
                      />
                    </Form.Field>
                    { errors[OLD_PASSWORD] && <div className={styles['error-text']}>{ errors[OLD_PASSWORD]?.message }</div> }

                    <Form.Field>
                      <label className={styles.label}>
                        <FormattedMessage id='profile.password.new' />
                      </label>
                      <Form.Input
                        type='password'
                        name={NEW_PASSWORD}
                        placeholder={intl.formatMessage({id: 'login.password.required'})}
                        error={ errors[NEW_PASSWORD] ? true : false }
                        onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                          setValue(detail.name, detail.value);
                          await trigger(NEW_PASSWORD);
                        }}
                      />
                    </Form.Field>
                    { errors[NEW_PASSWORD] && <div className={styles['error-text']}>{ errors[NEW_PASSWORD]?.message }</div> }
                    <div className={styles['tip-text']}>
                      <FormattedMessage id='login.password.tips' />
                    </div>

                    <Form.Field>
                      <label className={styles.label}>
                        <FormattedMessage id='profile.password.new.confirm' />
                      </label>
                      <Form.Input
                        type='password'
                        name={CONFIRM_NEW_PASSWORD}
                        placeholder={intl.formatMessage({id: 'login.password.required'})}
                        error={ errors[CONFIRM_NEW_PASSWORD] ? true : false }
                        onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                          if (detail.value !== getValues()[NEW_PASSWORD]) {
                            setError(CONFIRM_NEW_PASSWORD, {
                              message: intl.formatMessage({id: 'profile.password.not.match'})
                            });
                            return;
                          }
                          setValue(detail.name, detail.value);
                          await trigger(CONFIRM_NEW_PASSWORD);
                        }}
                      />
                    </Form.Field>
                    { errors[CONFIRM_NEW_PASSWORD] && <div className={styles['error-text']}>{ errors[CONFIRM_NEW_PASSWORD]?.message }</div> }
                  </div>

                  <Button 
                    primary 
                    type='submit'
                    className={styles.btn} 
                    disabled={ !!errors[OLD_PASSWORD] || !!errors[NEW_PASSWORD] || !!errors[CONFIRM_NEW_PASSWORD] } 
                  >
                    <FormattedMessage id='profile.password.update' />
                  </Button>
                </>
              )
            }
          </Form>
        </div>
      </div>
    </UserSettingLayout>
  );
};

export default Member;
