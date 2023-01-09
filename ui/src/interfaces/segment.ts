import { IRule, IVersion } from './targeting';
import { ISort, IPageable } from './toggle';

export interface ISegment {
  name: string;
  key: string;
  description: string;
  createdTime: string;
  createdBy: string;
  modifiedTime: string;
  modifiedBy: string;
}

export interface ISegmentList {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: ISegment[];
  number: number;
  empty: boolean;
}

export interface ISegmentInfo {
  name: string;
  key: string;
  description: string;
  projectKey?: string;
  createdTime?: string;
  createdBy?: string;
  modifiedTime?: string;
  modifiedBy?: string;
  rules: IRule[];
}

export interface IToggle {
  name: string,
  key: string,
  environmentName: string,
  environmentKey: string,
  disabled: boolean,
  description: string
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

export interface ISegmentVersion extends IVersion {
  version: number;
  rules: IRule[];
}

export interface ISegmentVersions {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: ISegmentVersion[];
  number: number;
  version: number;
  empty: boolean;
}