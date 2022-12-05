import { SyntheticEvent, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Form,
  Checkbox,
  Dropdown,
  FormField,
  DropdownProps,
  InputOnChangeData,
  CheckboxProps,
  DropdownItemProps,
} from 'semantic-ui-react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FormItemPassword from 'components/FormItem/password';
import { IUser, IFormParams } from 'interfaces/member';
import { createMember, updateMember, getMember } from 'services/member';
import styles from './index.module.scss';

interface IParams {
  isAdd: boolean;
  visible: boolean;
  editUser?: IUser
  setDrawerVisible: (visible: boolean) => void;
  refreshMemberList:(pageIndex: number) => void;
}

const DEFAULT_PASSWORD = 'Pass1234';
const EMAIL_REG = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;
const isDemo = localStorage.getItem('isDemo') === 'true';

const MemberDrawer = (props: IParams) => {
  const { isAdd, visible, editUser, setDrawerVisible, refreshMemberList } = props;
  const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false);
  const [ memberValues, setMemberValues ] = useState<string[]>([]);
  const [ dulplicateAccount, setDulplicateAccount ] = useState<string>(); 
  const [ role, saveRole ] = useState<string>('WRITER');
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    unregister,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
  } = useForm();

  const options = useMemo(() => {
    return [
      { 
        key: 'WRITER',
        value: 'WRITER',
        text: 'Writer',
        content: (
          <div>
            <div className={styles['role-title']}>Writer</div>
            <div className={styles['role-desc']}>
              <FormattedMessage id='members.writer.auth.text' />
            </div>
          </div>
        )
      },
      { 
        key: 'OWNER',
        value: 'OWNER',
        text: 'Owner',
        content: (
          <div className={styles['role-item']}>
            <div className={styles['role-title']}>Owner</div>
            <div className={styles['role-desc']}>
              <FormattedMessage id='members.owner.auth.text' />
            </div>
          </div>
        )
      },
    ];
  }, []);

  useEffect(() => {
    if (visible) {
      setMemberValues([]);
      setPasswordVisible(false);
    } else {
      setValue('accounts', '');
      setValue('account', '');
      setValue('password', '');
    }
    clearErrors();
    setValue('role', 'WRITER');
  }, [visible, setValue, clearErrors]);

  useEffect(() => {
    if (isAdd) {
      register('accounts', { 
        required: intl.formatMessage({id: 'members.add.members.placeholder'}),
      });
      unregister('account',
        { keepIsValid: true }
      );
    } else {
      register('account', { 
        required: intl.formatMessage({id: 'login.account.required'}),
      });
      unregister('accounts',
        { keepIsValid: true }
      );
    }
    register('role', { 
      required: intl.formatMessage({id: 'members.select.role.placeholder'}), 
    });
  }, [isAdd, intl, register, unregister]);

  useEffect(() => {
    if (!isDemo && (!isAdd || passwordVisible)) {
      register('password');
    } else {
      unregister('password', { keepIsValid: true });
    }
  }, [isAdd, passwordVisible, register, unregister]);

  useEffect(() => {
    setValue('account', editUser?.account);
    setValue('role', editUser?.role);
    if (editUser?.role) {
      saveRole(editUser?.role);
    }
  }, [editUser, setValue]);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customclass={styles['dropdown-remove-icon']} type='close' />,
    });
  }, []);

  // Add accounts
  const handleChange = useCallback(async (e: SyntheticEvent, detail: DropdownProps) => {
    setMemberValues(detail.value as string[]);
    setValue(detail.name, detail.value);
    await trigger('accounts');
  }, [trigger, setValue]);

  const handleCheckboxChange = useCallback((e: SyntheticEvent, detail: CheckboxProps) => {
    setPasswordVisible(!detail.checked);
  }, []);

  const onSubmit = async (data: IFormParams) => {
    if (isAdd) {
      const params: IFormParams = {
        accounts: [],
        password: ''
      };
      params.accounts = data.accounts;
      params.password = data.password || DEFAULT_PASSWORD;
      params.role = data.role;

      const res = await createMember(params);
      if (res.success) {
        message.success(intl.formatMessage({id: 'members.create.success.text'}));
        refreshMemberList(0);
        setDrawerVisible(false);
      } else {
        message.error(intl.formatMessage({id: 'members.create.error.text'}));
      }
    } else {
      const res = await updateMember(data);
      if (res.success) {
        message.success(intl.formatMessage({id: 'members.update.success.text'}));
        refreshMemberList(0);
        setDrawerVisible(false);
      } else {
        message.error(intl.formatMessage({id: 'members.update.error.text'}));
      }
    }
  };

  const valueOptions = useMemo(() => {
    return memberValues.map((item: string) => {
      return {
        key: item,
        text: item,
        value: item,
      };
    });
  }, [memberValues]);

  // Confirm add account
  const handleAddAccount = useCallback(async(event: SyntheticEvent, data: DropdownProps) => {
    const account: string = data.value as string;

    if (isDemo && !EMAIL_REG.test(account)) {
      message.error(intl.formatMessage({id: 'login.email.invalid.text'}));
      setDulplicateAccount(account);
      return;
    }

    const res = await getMember({
      account,
    });

    if (res.success) {
      message.error(intl.formatMessage({id: 'members.add.dulplicate.error.text'}));
      setDulplicateAccount(account);
    }
  }, [intl]);
  
  useEffect(() => {
    const filterMemberValues = memberValues.filter(member => member !== dulplicateAccount);
    if (filterMemberValues.length !== memberValues.length) {
      setMemberValues(filterMemberValues);
      setValue('accounts', filterMemberValues);
    }
  }, [dulplicateAccount, memberValues, setValue]);
 
  const drawerCls = classNames(
    styles['member-drawer'],
    {
      [styles['member-drawer-inactive']]: visible,
    }
  );

  const drawerFormCls = classNames(
    styles['member-drawer-form'],
    {
      [styles['member-drawer-form-inactive']]: visible,
    }
  );

	return (
    <div className={drawerCls}>
      <Form 
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)} 
        className={drawerFormCls}
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? intl.formatMessage({id: 'members.add.members'}) : intl.formatMessage({id: 'members.edit.member'}) }
          </div>
          <Button size='mini' primary type='submit'>
            { isAdd ? intl.formatMessage({id: 'common.add.text'}) : intl.formatMessage({id: 'common.save.text'}) }
          </Button>
          <div className={styles.divider}></div>
          <Icon customclass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        {
          isDemo && (
            <div className={styles['demo-tips']}>
              <FormattedMessage id='login.demo.password.tip' />
            </div> 
          )
        }
        <div className={styles['member-drawer-form-content']}>
          {/* Account */}
          {
            isAdd ? (
              <>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='common.accounts.text' />
                  </label>
                  <Dropdown
                    fluid
                    search
                    multiple
                    selection
                    allowAdditions
                    floating
                    size='mini'
                    name='accounts'
                    icon={null}
                    options={valueOptions}
                    value={memberValues}
                    noResultsMessage={null}
                    error={ errors.accounts ? true : false }
                    className={styles.dropdown}
                    placeholder={intl.formatMessage({id: 'members.add.members.placeholder'})}
                    renderLabel={renderLabel}
                    onAddItem={handleAddAccount}
                    onChange={(e: SyntheticEvent, detail: DropdownProps) => handleChange(e, detail)}
                  />
                </Form.Field>
                { errors.accounts && <div className={styles['error-text']}>{ errors.accounts.message }</div> }

                {
                  !isDemo && (
                    <FormField>
                      <Checkbox 
                        checked={ !passwordVisible } 
                        label={intl.formatMessage({id: 'members.defalut.password'})}
                        onChange={handleCheckboxChange} 
                      />
                      <div>
                        <div className={styles.password}>
                          { DEFAULT_PASSWORD }
                        </div>
                      </div>
                    </FormField>
                  )
                }
              </>
            ) : (
              <>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='common.account.text' />
                  </label>
                  <Form.Input
                    disabled
                    name='account'
                    className={styles.input}
                    value={ editUser?.account || '' }
                    placeholder={intl.formatMessage({id: 'login.account.required'})}
                    error={ errors.account ? true : false }
                    onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                      if (detail.value.length > 50 ) return;
                      setValue(detail.name, detail.value);
                      await trigger('account');
                    }}
                  />
                </Form.Field>
                { errors.account && <div className={styles['error-text']}>{ errors.account.message }</div> }
              </>
            )
          }
          
          {/* Password */}
          {
            (!isAdd || passwordVisible) && !isDemo && (
              <FormItemPassword 
                errors={errors}
                register={register}
                onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                  setValue(detail.name, detail.value);
                  await trigger('password');
                }}
              />
            )
          }

          {/* Role */}
          <Form.Field className={`${styles.joyride} joyride-return-type`}>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='members.role' />
            </label>
            <Dropdown 
              fluid
              floating
              selection 
              clearable
              value={ role }
              name='role'
              error={ errors.role ? true : false }
              options={options} 
              placeholder={intl.formatMessage({id: 'toggles.returntype.placeholder'})}
              icon={ <Icon customclass={styles['angle-down']} type='angle-down' /> }
              onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                setValue(detail.name, detail.value);
                saveRole(detail.value as string);
                await trigger('role');
              }}
            />
          </Form.Field>
          { errors.role && <div className={styles['error-text']}>{ errors.role.message }</div> }
          {
            !isAdd && <div className={styles['role-tips']}><FormattedMessage id='members.role.tips' /></div>
          }
        </div>
      </Form>
    </div>
	);
};

export default MemberDrawer;