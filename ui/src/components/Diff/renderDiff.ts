import { ReactNode } from 'react';
import { diffType, positionType } from './constants';
import { ArrayObj, ChangeItem } from './diff';

interface FieldRenderObj {
  type: diffType;
  value: unknown;
}
type renderFunc = (fileds: Map<string, FieldRenderObj>) => ReactNode;

//Render object diff 
export function renderField(diffContent: ChangeItem[], type: positionType, render: renderFunc) {
  const after = type === 'after';
  const map = new Map();
  diffContent.forEach((current) => {
    if (current.type === 'add' && !after) {
      return;
    }
    if (current.type === 'remove' && after) {
      return;
    }
    const type = current.type;
    if(current.value) {
      map.set((current.value as ArrayObj).__key, {
        type,
        value: type === 'modify' ? current.diff : (current.value as ArrayObj).__value,
      });
    }
  }, map);

  return render(map);
}

type ItemsRenderFunc<T> = (fileds: ChangeItem[] | T, diffType: diffType, type: positionType, index: number) => ReactNode;

//Render list diff 
export function renderFieldsItems<T>(diffContent: ChangeItem[], type: positionType, render: ItemsRenderFunc<T>) {
  const values: ReactNode[] = [];

  for (let i = 0; i < diffContent.length; i++) {
    const diffItem = diffContent[i];
    if (diffItem.type === 'modify') {
      values.push(render(diffItem.diff ?? [], 'modify', type, i));
    } else {
      values.push(render(diffItem.value as T, diffItem.type, type, i));
    }
  }
  
  return values;
}
