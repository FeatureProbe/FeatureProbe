import { SyntheticEvent, useState } from 'react';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';

interface IInfo {
  [key: string]: string;
}

export const useProjectInfo = () => {
  const [ projectInfo, saveProjectInfo ] = useState<IInfo>({
    name: '',
    key: '',
    description: '',
  });

  const [ originProjectInfo, saveOriginProjectInfo ] = useState<IInfo>({
    name: '',
    key: '',
    description: '',
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps , type: string) => {
    projectInfo[type] = detail.value as string;
    saveProjectInfo({...projectInfo});
  };

  return {
    projectInfo,
    originProjectInfo,
    handleChange,
    saveProjectInfo,
    saveOriginProjectInfo,
  };
};

export const useEnvironmentInfo = () => {
  const [ environmentInfo, saveEnvironmentInfo ] = useState<IInfo>({
    name: '',
    key: '',
  });

  const [ originEnvironmentInfo, saveOriginEnvironmentInfo ] = useState<IInfo>({
    name: '',
    key: '',
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps , type: string) => {
    environmentInfo[type] = detail.value as string;
    saveEnvironmentInfo({...environmentInfo});
  };

  return {
    environmentInfo,
    originEnvironmentInfo,
    handleChange,
    saveEnvironmentInfo,
    saveOriginEnvironmentInfo,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};
