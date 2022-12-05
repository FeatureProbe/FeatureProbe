import { SyntheticEvent, useState } from 'react';
import { InputOnChangeData, TextAreaProps, DropdownProps, CheckboxProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { IWebHookInfo, WebHookStatus } from 'interfaces/webhook';

export const useWebHookInfo = () => {
  const [webHookInfo, saveWebHookInfo] = useState<IWebHookInfo>({
    name: '',
    description: '',
    url: '',
    status: WebHookStatus.ENABLE,
  });

  const [ originWebHookInfo, saveOriginWebHookInfo ] = useState<IWebHookInfo>({
    name: '',
    description: '',
    url: '',
    status: WebHookStatus.ENABLE,
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps | DropdownProps | CheckboxProps, type: string) => {
    webHookInfo[type] = detail.value as string;

    saveWebHookInfo({...webHookInfo});
  };

  const handleChangeStatus = (status?: boolean) => {
    webHookInfo.status = status ? WebHookStatus.ENABLE : WebHookStatus.DISABLE;

    saveWebHookInfo({...webHookInfo});
  };

  const init = () => {
    saveWebHookInfo({
      name: '',
      description: '',
      url: '',
      status: WebHookStatus.ENABLE,
    });
    saveOriginWebHookInfo({
      name: '',
      description: '',
      url: '',
      status: WebHookStatus.ENABLE,
    });
  };

  return {
    webHookInfo,
    originWebHookInfo,
    init,
    handleChange,
    handleChangeStatus,
    saveWebHookInfo,
    saveOriginWebHookInfo,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};
