import { ArrayChange } from 'diff';
import { ReactNode } from 'react';
import { diffType, positionType } from './constants';
import { ArrayObj, DiffResult } from './diff';

interface FieldRenderObj {
  type: diffType;
  value: unknown;
}
type renderFunc = (fileds: Map<string, FieldRenderObj>) => ReactNode;

//Render object diff 
export function renderField(diffContent: DiffResult, type: positionType, render: renderFunc) {
  const after = type === 'after';
  const map = new Map();
  diffContent.forEach((current) => {
    let type = '';
    if (current.added && !after) {
      return;
    }
    if (current.removed && after) {
      return;
    }
    if (current.added) {
      type = 'add';
    }
    if (current.removed) {
      type = 'remove';
    }
    if(current.modified) {
      type = 'modify';
    }
    if(!current.added && !current.modified && !current.removed) {
      type = 'same';
    }
    current.value.forEach((current) => {
      if ((current as ArrayObj).__key) {
        map.set((current as ArrayObj).__key, {
          type,
          value: (current as ArrayObj).__value,
        });
      }
    });
  }, map);

  return render(map);
}

type ItemsRenderFunc<T> = (fileds: DiffResult | T | ArrayChange<unknown>, diffType: diffType, type: positionType, index: number) => ReactNode;

//Render list diff 
export function renderFieldsItems<T>(diffContent: DiffResult, type: positionType, render: ItemsRenderFunc<T>) {
  let values: ReactNode[] = [];
  let count = 0;

  for (let i = 0; i < diffContent.length; i++) {
    const diffItem = diffContent[i];
    if (diffItem.modified) {
      values = values.concat(
        diffItem.value.map((item) => {
          if((item as ArrayChange<unknown>).value instanceof Array && (item as ArrayChange<unknown>).value.length !== 1) {
            count++;
            return render(item as DiffResult | ArrayChange<unknown>, 'modify', type, count);
          } else {
            count++;
            return render(item as DiffResult | ArrayChange<unknown>, 'same', type, count);
          }
        })
      );
    } else if (diffItem.removed) {
      values = values.concat(
        diffItem.value.map((item) => {
          count++;
          return render(item as T, 'remove', type, count);
        })
      );
    } else if (diffItem.added) {
      values = values.concat(
        diffItem.value.map((item) => {
          count++;
          return render(item as T, 'add', type, count);
        })
      );
    } else if(!diffItem.added && !diffItem.removed && (!diffItem.modified || diffItem.value.length === 1)) {
      values = values.concat(
        diffItem.value.map((item) => {
          count++;
          return render(item as T, 'same', type, count);
        })
      );
    }
  }
  return values;
}
