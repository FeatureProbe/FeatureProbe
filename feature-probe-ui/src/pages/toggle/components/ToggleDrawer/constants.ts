import { v4 as uuidv4} from 'uuid';

const fisrt_id = uuidv4();
const second_id = uuidv4();
export const initVariations = [
  {
    id: fisrt_id,
    value: '', 
    name: 'variation1', 
    description: '',
  },
  {
    id: second_id,
    value: '', 
    name: 'variation2', 
    description: '',
  }
];

export const initBooleanVariations = [
  {
    id: fisrt_id,
    value: 'false', 
    name: 'variation1', 
    description: '',
  },
  {
    id: second_id,
    value: 'true', 
    name: 'variation2', 
    description: '',
  }
];

export const returnTypeOptions = [
  { key: 'boolean', value: 'boolean', text: 'boolean' },
  { key: 'string', value: 'string', text: 'string' },
  { key: 'number', value: 'number', text: 'number' },
  { key: 'json', value: 'json', text: 'json' },
];
