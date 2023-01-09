import { SyntheticEvent, useState } from 'react';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';

interface IInfo {
  [key: string]: string;
}

export const useSegmentInfo = () => {
  const [ segmentInfo, saveSegmentInfo ] = useState<IInfo>({
    name: '',
    key: '',
    description: '',
  });

  const [ originSegmentInfo, saveOriginSegmentInfo ] = useState<IInfo>({
    name: '',
    key: '',
    description: '',
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps , type: string) => {
    segmentInfo[type] = detail.value as string;
    saveSegmentInfo({...segmentInfo});
  };

  return {
    segmentInfo,
    originSegmentInfo,
    handleChange,
    saveSegmentInfo,
    saveOriginSegmentInfo,
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
