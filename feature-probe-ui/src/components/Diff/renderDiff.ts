import { ArrayChange } from 'diff';
import { ReactNode } from 'react';
import { ArrayObj, DiffResult } from './diff';

interface FieldRenderObj {
  type: 'remove' | 'add' | 'modify' | 'same';
  value: unknown;
}
type renderFunc = (fileds: Map<string, FieldRenderObj>) => ReactNode;

export function renderField(diffContent: DiffResult, type: 'after' | 'before', render: renderFunc) {
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

type ItemsRenderFunc<T> = (fileds: DiffResult | T | ArrayChange<unknown>, diffType: 'remove' | 'add' | 'modify' | 'same', type: 'after' | 'before', index: number) => ReactNode;

export function renderFieldsItems<T>(diffContent: DiffResult, type: 'after' | 'before', render: ItemsRenderFunc<T>) {
  let values: ReactNode[] = [];
  let count = 0;
  for (let i = 0; i < diffContent.length; i++) {
    const diffItem = diffContent[i];
    if (diffItem.modified) {
      values = values.concat(
        diffItem.value.map((item) => {
          count++;
          return render(item as DiffResult | ArrayChange<unknown>, 'modify', type, count);
        })
      );
    }
    if (diffItem.removed) {
      values = values.concat(
        diffItem.value.map((item) => {
          count++;
          return render(item as T, 'remove', type, count);
        })
      );
    }
    if (diffItem.added) {
      values = values.concat(
        diffItem.value.map((item) => {
          count++;
          return render(item as T, 'add', type, count);
        })
      );
    }
    if(!diffItem.added && !diffItem.removed && !diffItem.modified) {
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
