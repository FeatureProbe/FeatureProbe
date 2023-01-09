import { IVariation } from './targeting';

export interface ISort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean
}

export interface IPageable {
  sort: ISort;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
  offset: number
}

export interface IToggle {
  name: string;
  key: string;
  returnType: string;
  desc: string;
  tags: string[];
  disabled: true;
  visitedTime: string;
  modifiedTime: string;
  modifiedBy: string;
  locked?: boolean;
  lockedBy?: string;
  lockedTime?: string;
  releaseStatus: string;
  permanent: boolean;
  useDays?: number;
}

export interface IEditToggleParams {
  name?: string;
  key?: string;
  returnType?: string;
  desc?: string;
  tags?: string[];
  disabled?: boolean;
  clientAvailability?: boolean;
  permanent?: boolean;
}

export interface IToggleList {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: IToggle[];
  number: number;
  empty: boolean;
}

export interface IToggleInfo {
  name: string;
  key: string;
  returnType: string;
  disabledServe: number;
  archived?: boolean;
  desc: string;
  variations?: IVariation[];
  clientAvailability: boolean | undefined;
  tags: string[];
  createdTime?: string;
  createdBy?: string;
  modifiedTime?: string;
  modifiedBy?: string;
  permanent: boolean;
  useDays?: number;
}