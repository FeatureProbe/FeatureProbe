
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import  { Radio, CheckboxProps, Form, Dropdown, DropdownProps, DropdownItemProps, Popup } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { cloneDeep, isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { EnvironmentColors } from 'constants/colors';
import ProjectLayout from 'layout/projectLayout';
import { HeaderContainer } from 'layout/hooks';
import Icon from 'components/Icon';
import Button from 'components/Button';
import message from 'components/MessageBox';
import Loading from 'components/Loading';
import { getMemberList } from 'services/member';
import { getProjectApprovalSettings, saveSettings } from 'services/project';
import { IApprovalSetting } from 'interfaces/approval';
import { IMember, IMemberList } from 'interfaces/member';
import { IOption } from 'interfaces/targeting';
import { OWNER } from 'constants/auth';
import styles from './index.module.scss';

interface IParams {
  projectKey: string;
  environmentKey: string;
}

const ProjectSetting = () => {
  const [ approvalSetting, saveApprovalSetting ] = useState<IApprovalSetting[]>([]);
  const [ originSetting, saveOriginSetting ] = useState<IApprovalSetting[]>([]);
  const [ isSame, saveIsSame ] = useState<boolean>(false);
  const [ options, saveOptions ] = useState<IOption[]>([]);
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);

  const intl = useIntl();
  const { projectKey } = useParams<IParams>();
  const { userInfo } = HeaderContainer.useContainer();
  const { trigger, formState: { errors }, register, clearErrors } = useForm();
  const [ submitLoading, setSubmitLoading ] = useState<boolean>(false);

  const init = useCallback(async () => {
    getProjectApprovalSettings<IApprovalSetting[]>(projectKey).then(res => {
      saveIsLoading(false);
      const { success, data } = res;
      if (success && data) {
        saveApprovalSetting(data);
        saveOriginSetting(cloneDeep(data));
      }
    });

    const res = await getMemberList<IMemberList>({
      pageIndex: 0,
      pageSize: 10,
    });

    const { success, data } = res;
    if (success && data) {
      const { content } = data;
      const options = content.map((member: IMember) => {
        return ({
          key: member.account,
          value: member.account,
          text: member.account,
        });
      });
      saveOptions(options);
    }
  }, [projectKey]);

  useEffect(() => {
    const isSame = isEqual(approvalSetting, originSetting);
    saveIsSame(isSame);
  }, [approvalSetting, originSetting]);

  useEffect(() => {
    init();
  }, [init]);

  const renderLabel = useCallback((label: DropdownItemProps, setting: IApprovalSetting) => {
    const cantRemove: boolean = setting.reviewers.length === 1 && setting.enable === true;
    return ({
      content: label.text,
      removeIcon: !cantRemove && <Icon type='close' customclass={styles['dropdown-remove-icon']} />
    });
  }, []);

  const handleChangeApproval = useCallback((environmentKey: string, reviewers: string[], index: number) => {
    const settings = cloneDeep(approvalSetting);
    settings.forEach((setting: IApprovalSetting) => {
      if (setting.environmentKey === environmentKey) {
        if(!(setting.enable === true && reviewers.length === 0)) {
          setting.reviewers = reviewers;
        }
      }
    });

    saveApprovalSetting(settings);
    if(settings[index].reviewers.length) {
      clearErrors(`approval-reviewers-${index}`);
    }
  }, [approvalSetting, clearErrors]);

  const saveToggleDisable = useCallback((environmentKey:string, checked: boolean) => {
    const settings = cloneDeep(approvalSetting);
    settings.forEach((setting: IApprovalSetting) => {
      if (setting.environmentKey === environmentKey && setting.reviewers.length > 0) {
        setting.enable = checked;
      }
    });

    saveApprovalSetting(settings);
  }, [approvalSetting]);

  const handleSubmit = useCallback(() => {
    setSubmitLoading(true);
    saveSettings(projectKey, {
      approvalSettings: approvalSetting,
    }).then((res) => {
      if(res.success) {
        message.success(intl.formatMessage({id: 'toggles.settings.save.success'}));
        saveIsSame(true);
        saveOriginSetting(approvalSetting);
        clearErrors();
      } else {
        message.error(intl.formatMessage({id: 'toggles.settings.save.error'}));
      }
      setSubmitLoading(false);
    }).catch(() => {
      setSubmitLoading(false);
    });
  }, [intl, projectKey, approvalSetting, clearErrors]);

  return (
    <ProjectLayout>
      <div className={styles.setting}>
        {
          isLoading ? <Loading /> : (
            <>
              <div className={styles.content}>
                <div className={styles.title}>
                  <FormattedMessage id='common.toggle.appoval.settings.text' />
                </div>
                <div className={styles.tips}>
                  <Icon type='warning-circle' customclass={styles['warning-circle']}></Icon>
                  <FormattedMessage id='toggles.settings.tips' />
                </div>
                <div>
                  <Form className={styles['approval-form']}>
                    <Form.Group>
                      <Form.Field width={2}>
                        <label className={styles.label}>
                          <FormattedMessage id='common.environment.text' />:
                        </label>
                      </Form.Field>
                      <Form.Field width={12}>
                        <label className={styles.label}>
                          <FormattedMessage id='toggles.settings.approval.reviewers' />:
                        </label>
                      </Form.Field>
                      <Form.Field width={2}>
                        <label className={styles.label}>
                          <FormattedMessage id='toggles.settings.approval.enable' />:
                        </label>
                      </Form.Field>
                    </Form.Group>
                    {
                      approvalSetting.map((setting: IApprovalSetting, index: number) => {
                        return (
                          <Form.Group className={styles.group} key={setting.environmentKey}>
                            <Form.Field width={2}>
                              <div className={styles['environment-name-box']}>
                                <div className={styles['color-square']} style={{background: EnvironmentColors[index % 5]}}/>
                                <div className='environment-name-text'>{setting.environmentName}</div>
                              </div>
                            </Form.Field>
                            <Form.Field className={styles['approval-reviewers-dropdown-field']} width={12}>
                              <Dropdown
                                {
                                  ...register(`approval-reviewers-${index}`, {
                                    validate: () => !(approvalSetting[index].reviewers.length === 0) || intl.formatMessage({ id: 'toggles.settings.approval.reviewers.placeholder' })
                                  })
                                }
                                error={ errors[`approval-reviewers-${index}`] ? true : false }
                                placeholder={intl.formatMessage({id: 'toggles.settings.approval.reviewers.placeholder'})}
                                search
                                selection
                                multiple
                                floating
                                options={options}
                                value={setting.reviewers}
                                openOnFocus={false}
                                renderLabel={(label) => {
                                  return renderLabel(label, setting);
                                }}
                                disabled={!OWNER.includes(userInfo.role)}
                                icon={<Icon customclass={styles['angle-down']} type='angle-down' />}
                                noResultsMessage={null}
                                onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                                  handleChangeApproval(setting.environmentKey, detail.value as string[], index);
                                }}
                              />
                              { errors[`approval-reviewers-${index}`] && <div className={styles['error-text']}>{ intl.formatMessage({ id: 'toggles.settings.approval.reviewers.placeholder' }) }</div> }
                            </Form.Field>
                            <Form.Field width={2}>
                              <Popup
                                inverted
                                disabled={OWNER.includes(userInfo.role) && !setting.locked}
                                className='popup-override'
                                trigger={
                                  <Radio
                                    size='mini'
                                    toggle 
                                    checked={setting.enable}
                                    onChange={(e: SyntheticEvent, data: CheckboxProps) => {
                                      saveToggleDisable(setting.environmentKey, !!data.checked);
                                      trigger(`approval-reviewers-${index}`);
                                    }} 
                                    className={styles['approval-status']} 
                                    disabled={!OWNER.includes(userInfo.role) || setting.locked}
                                  />
                                }
                                content={
                                  !OWNER.includes(userInfo.role) 
                                    ? intl.formatMessage({ id: 'toggles.settings.approval.enable.writer.tips' }) 
                                    : intl.formatMessage({ id: 'toggles.settings.approval.enable.tips' })
                                  }
                                position='top left'
                                wide
                              />
                              
                            </Form.Field>
                          </Form.Group>
                        );
                      })
                    }
                  </Form>
                </div>
              </div>
              <div className={styles.footer}>
                <Button 
                  primary 
                  type='submit' 
                  className={styles['publish-btn']} 
                  onClick={handleSubmit}
                  disabled={!OWNER.includes(userInfo.role) || isSame || submitLoading}
                  loading={submitLoading}
                >
                  <span className={styles['publish-btn-text']}>
                    <FormattedMessage id='common.save.text' />
                  </span>
                </Button>
              </div>
            </>
          )
        }
      </div>
    </ProjectLayout>
  );
};

export default ProjectSetting;