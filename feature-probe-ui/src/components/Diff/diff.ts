import {diffArrays, ArrayChange} from 'diff';

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

export type DiffParam = ArrayObj[] | DiffObj | unknown[]

export type DiffResult = (ArrayChange<unknown> & { modified?: boolean  })[];

const compared = (obj1: DiffObj | ArrayObj, obj2: DiffObj | ArrayObj) => {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    if (obj1.__key !== undefined && obj2.__key !== undefined) {
      if (typeof obj1.__value === 'object' && typeof obj2.__value === 'object' && obj1.__value && obj2.__value) {
        return diffObj(obj1.__value as DiffObj, obj2.__value as DiffObj).length === 1;
      }
      return obj1.__value === obj2.__value;
    }
    return diffObj(obj1 as ArrayObj[], obj2 as ArrayObj[]).length === 1;
  } else {
    return obj1 === obj2;
  }
};

function diffObj(left: DiffParam, right: DiffParam): ArrayChange<ArrayObj | DiffObj>[] {
  if (left instanceof Array && right instanceof Array) {
    return diff.diffArrays<ArrayObj, ArrayObj>(left as ArrayObj[], right as ArrayObj[], {
      comparator: compared,
    });
  } else {
    const leftArr = Object.keys(left).map((key) => {
      return { __key: key, __value: (left as DiffObj)[key] };
    }).sort((a, b) => {
      return a.__key > b.__key ? 1 : -1;
    });
    const rightArr = Object.keys(right).map((key) => {
      return { __key: key, __value: (right as DiffObj)[key] };
    }).sort((a, b) => {
      return a.__key > b.__key ? 1 : -1;
    });

    return diff.diffArrays(leftArr, rightArr, {
      comparator: compared,
    });
  }
}

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

const resetDiffResult = (diffContent: ArrayChange<DiffObj | ArrayObj>[]) => {
  let result: DiffResult = [];

  for (let i = 0; i < diffContent.length; i++) {
    if (diffContent[i].removed) {
      if (i + 1 < diffContent.length && diffContent[i + 1].added) {
        result = [...result, ...toModified(diffContent[i].value as DiffObj[], diffContent[i + 1].value as DiffObj[])];
        i++;
      } else {
        result.push(diffContent[i]);
      }
    } else {
      result.push(diffContent[i]);
    }
  }

  return result;
};

function toModified(removed: DiffObj[], added: DiffObj[]) {
  const result: DiffResult  = [];
  let modifies = [];
  let removeds = [];
  let addeds = [];
  let i = 0;
  for (i; i < removed.length; i++) {
    if (i >= added.length) {
      break;
    }
    const left = removed[i];
    const right = added[i];

    const isDiff = isTryToDiff(right);
    if (isDiff.flag) {
      if (removeds.length) {
        result.push({ count: removeds.length, removed: true, value: removeds });
        result.push({ count: addeds.length, added: true, value: addeds });
        removeds = [];
        addeds = [];
      }

      if (isDiff.type === 'key-value' && left.__key === right.__key) {
        modifies.push({ __key: right.__key, __value: resetDiffResult(diffObj(left.__value as DiffParam, right.__value as DiffParam)) });
      } else if(left.key !== right.__key) {
        removeds.push(left);
        addeds.push(right);
      } else {
        modifies.push({ count: 1, modified: true, value: resetDiffResult(diffObj(left, right)) });
      }
    } else {
      if (modifies.length) {
        result.push({ count: modifies.length, modified: true, value: modifies });
        modifies = [];
      }

      removeds.push(left);
      addeds.push(right);
    }
  }

  if (removeds.length) {
    result.push({ count: removeds.length, removed: true, value: removeds });
  }

  if (addeds.length) {
    result.push({ count: addeds.length, added: true, value: addeds });
  }

  if (modifies.length) {
    result.push({ count: modifies.length, modified: true, value: modifies });
  }

  const last = result[result.length - 1];
  if (removed.length > added.length) {
    if (last.modified) {
      result.push({ count: added.length - removed.length, removed: true, value: removed.slice(added.length) });
    } else if (last.added) {
      result[result.length - 2].value = result[result.length - 2].value.concat(removed.slice(added.length));
    }
  } else if (removed.length < added.length) {
    if (last.modified) {
      result.push({ count: removed.length - added.length, added: true, value: added.slice(removed.length) });
    } else if (last.added) {
      last.value = last.value.concat(added.slice(removed.length));
    }
  }

  return result;
};


function idiff (left: DiffParam, right: DiffParam): DiffResult {
  return resetDiffResult(diffObj(left, right));
}
export default idiff;
