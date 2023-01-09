import { useState } from 'react';
import { InputOnChangeData, TextAreaProps, DropdownProps, CheckboxProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { IToken } from 'interfaces/token';

export const useTokenInfo = () => {
  const [tokenInfo, saveTokenInfo] = useState<IToken>({
    name: '',
    role: undefined,
  });

  const [ originTokenInfo, saveOriginTokenInfo ] = useState<IToken>({
    name: '',
    role: undefined
  });

  const handleChange = (detail: InputOnChangeData | TextAreaProps | DropdownProps | CheckboxProps, type: string) => {
    tokenInfo[type] = detail.value as string;

    saveTokenInfo({...tokenInfo});
  };

  const init = () => {
    saveTokenInfo({
      name: '',
      role: undefined
    });
    saveOriginTokenInfo({
      name: '',
      role: undefined
    });
  };

  return {
    tokenInfo,
    originTokenInfo,
    init,
    handleChange,
    saveTokenInfo,
    saveOriginTokenInfo,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};
