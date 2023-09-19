import { diffArrays, ArrayChange } from 'diff';

const diff = {
  diffArrays,
};

export interface DiffObj {
  [x: string]: unknown;
}

export interface ArrayObj {
  __key?: string;
  __value?: unknown;
}

export type DiffResult = ChangeItem[];

export type ChangeType = 'remove' | 'add' | 'modify' | 'same';

export const displayMap = new Map([
  ['>=', '['],
  ['>', '('],
  ['<', ')'],
  ['<=', ']'],
]);

export interface ChangeItem {
  type: ChangeType;
  value?: unknown;
  diff?: ChangeItem[];
}

//compare in diff function
const compared = (obj1: DiffObj | ArrayObj, obj2: DiffObj | ArrayObj) => {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    if (obj1.__key !== undefined && obj2.__key !== undefined) {
      if (typeof obj1.__value === 'object' && typeof obj2.__value === 'object' && obj1.__value && obj2.__value) {
        return diffObj(obj1.__value as DiffObj, obj2.__value as DiffObj).length === 1;
      }
      return obj1.__value === obj2.__value;
    } else if ((obj1 as DiffObj)['conditions']) {
      return false;
    }
    return diffObj(obj1 as DiffObj, obj2 as DiffObj).length === 1;
  } else {
    return obj1 === obj2;
  }
};

//diff any object or array
function diffObj(left: unknown, right: unknown): ArrayChange<ArrayObj | DiffObj>[] {
  if (left instanceof Array && right instanceof Array) {
    return diff.diffArrays<ArrayObj, ArrayObj>(left as ArrayObj[], right as ArrayObj[], {
      comparator: compared,
    });
  } else {
    const leftArr = Object.keys(left as object)
      .map((key) => {
        if (key === 'objects' && (left as DiffObj)['leftPredicate'] ) {
          return { 
            __key: key, 
            __value: 
              '' + 
              displayMap.get((left as DiffObj)['leftPredicate'] as string) + 
              (left as DiffObj)['objects'] + 
              ', ' + 
              (left as DiffObj)['rightObjects'] + 
              displayMap.get((left as DiffObj)['rightPredicate'] as string)
            };
        } else {
          return { __key: key, __value: (left as DiffObj)[key] };
        }
      })
      .filter((item) => {
        return item.__key !== 'leftPredicate' && item.__key !== 'rightPredicate' && item.__key !== 'rightObjects';
      })
      .sort((a, b) => {
        return a.__key > b.__key ? 1 : -1;
      });
    const rightArr = Object.keys(right as object)
      .map((key) => {
        if (key === 'objects' && (right as DiffObj)['leftPredicate']) {
          return { 
            __key: key, 
            __value: 
              '' + 
              displayMap.get((right as DiffObj)['leftPredicate'] as string) + 
              (right as DiffObj)['objects'] + 
              ', ' + 
              (right as DiffObj)['rightObjects'] + 
              displayMap.get((right as DiffObj)['rightPredicate'] as string)
            };
        } else {
          return { __key: key, __value: (right as DiffObj)[key] };
        }
      })
      .filter((item) => {
        return item.__key !== 'leftPredicate' && item.__key !== 'rightPredicate' && item.__key !== 'rightObjects';
      })
      .sort((a, b) => {
        return a.__key > b.__key ? 1 : -1;
      });

    return diff.diffArrays(leftArr, rightArr, {
      comparator: compared,
    });
  }
}

//Determine whether to continue to diff value
const isTryToDiff = (value: ArrayObj) => {
  if (typeof value === 'object') {
    if (value.__key !== undefined && value.__value !== undefined) {
      if (typeof value.__value === 'object') {
        return {
          flag: true,
          type: 'key-value',
        };
      }
    } else {
      return {
        flag: true,
        type: 'object',
      };
    }
  }
  return {
    flag: false,
  };
};

//reset result to modified
const resetDiffResult = (diffContent: ArrayChange<DiffObj | ArrayObj>[]) => {
  let result: ChangeItem[] = [];

  for (let i = 0; i < diffContent.length; i++) {
    if (diffContent[i].removed) {
      if (i + 1 < diffContent.length && diffContent[i + 1].added) {
        result = [...result, ...toModified(diffContent[i].value as DiffObj[], diffContent[i + 1].value as DiffObj[])];
        i++;
      } else {
        result = result.concat(diffContent[i].value.map((item) => {
          return {
            type: 'remove',
            value: item
          };
        }));
      }
    } else {
      result = result.concat(diffContent[i].value.map((item) => {
        let type: ChangeType = 'same';
        if(diffContent[i].added) {
          type = 'add';
        }
        if(diffContent[i].removed) {
          type = 'remove';
        }
        return {
          type,
          value: item
        };
      }));
    }
  }

  return result;
};

function setRemain(
  removed: DiffObj[],
  added: DiffObj[],
  result: ChangeItem[],
  index: number
) {
  if(index < removed.length) {
    for(let i = index; i < removed.length; i++) {
      result.push({
        type: 'remove',
        value: removed[i]
      });
    }
  }

  if(index < added.length) {
    for(let i = index; i < added.length; i++) {
      result.push({
        type: 'add',
        value: added[i]
      });
    }
  }
}

//let remove + add to modify
function toModified(removed: DiffObj[], added: DiffObj[]) {
  const result: ChangeItem[] = [];
  let i = 0;
  for (i; i < removed.length; i++) {
    if (i >= added.length) {
      break;
    }
    const left = removed[i];
    const right = added[i];

    const isDiff = isTryToDiff(right);
    if (isDiff.flag) {
      if (isDiff.type === 'key-value' && left.__key === right.__key) {
        const diff = diffObj(left.__value, right.__value);
        const type = diff.length === 1 && !diff[0].added && !diff[0].removed ? 'same' : 'modify';

        result.push({
          type,
          value: right,
          diff: type === 'modify' ? resetDiffResult(diff) : undefined
        });
      } else if (left.__key !== right.__key) {
        result.push({
          type: 'remove',
          value: left,
        });
        result.push({
          type: 'add',
          value: right,
        });
      } else {
        const diff = diffObj(left, right);
        const type = diff.length === 1 && !diff[0].added && !diff[0].removed ? 'same' : 'modify';

        result.push({
          type,
          value: right,
          diff: type === 'modify' ? resetDiffResult(diff) : undefined
        });
      }
    } else {
      result.push({
        type: 'remove',
        value: left,
      });
      result.push({
        type: 'add',
        value: right,
      });
    }
  }

  setRemain(removed, added, result, i);

  return result;
}

function idiff(left: unknown, right: unknown): ChangeItem[] {
  return resetDiffResult(diffObj(left, right));
}

export default idiff;
