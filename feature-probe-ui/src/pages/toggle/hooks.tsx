import { SyntheticEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InputOnChangeData, TextAreaProps, DropdownProps, CheckboxProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { IVariation } from 'interfaces/targeting';
import { IToggleInfo } from 'interfaces/toggle';
import { getVariationName } from 'utils/tools';

export const useVarition = () => {
  const [variations, saveVariations] = useState<IVariation[]>([]);

  const handleAdd = () => {
    const name = getVariationName(variations);

    variations.push({
      id: uuidv4(),
      value: '',
      name,
      description: '',
    });
    saveVariations([...variations]);
  };

  const handleDelete = (index: number) => {
    variations.splice(index, 1);
    saveVariations([...variations]);
  };

  const handleInput = (e: SyntheticEvent, detail: InputOnChangeData) => {
    const { value, index, customname } = detail;

    if (variations[index]) {
      // @ts-ignore detail value
      variations[index][customname] = value;
    }

    saveVariations([...variations]);
  };

  const handleChangeVariation = (index: number, value: string) => {
    if (variations[index]) {
      variations[index]['value'] = value;
    }

    saveVariations([...variations]);
  };

  return { 
    variations, 
    saveVariations, 
    handleAdd, 
    handleDelete, 
    handleInput,
    handleChangeVariation,
  };
};

export const useToggleInfo = () => {
  const [toggleInfo, saveToggleInfo] = useState<IToggleInfo>({
    name: '',
    key: '',
    desc: '',
    tags: [],
    clientAvailability: false,
    returnType: 'boolean',
    disabledServe: 0,
    permanent: false,
  });

  const [ originToggleInfo, saveOriginToggleInfo ] = useState<IToggleInfo>({
    name: '',
    key: '',
    desc: '',
    tags: [],
    clientAvailability: false,
    returnType: 'boolean',
    disabledServe: 0,
    permanent: false,
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps | DropdownProps | CheckboxProps, type: string) => {
    const value = detail.value;

    if (type === 'clientAvailability') {
      toggleInfo[type] = detail.name === 'yes';
    } else if ( type === 'permanent' ) {
      toggleInfo[type] = detail.name === 'permanent-yes';
    } else {
      // @ts-ignore detail value
      toggleInfo[type] = value;
    }

    saveToggleInfo({...toggleInfo});
  };

  return {
    toggleInfo,
    originToggleInfo,
    handleChange,
    saveToggleInfo,
    saveOriginToggleInfo,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};
