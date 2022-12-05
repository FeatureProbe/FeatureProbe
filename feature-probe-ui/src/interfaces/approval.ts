import { IPageable, ISort } from './toggle';

export interface IApproval {
  approvedBy: string;
  createdTime: string;
  environmentKey: string;
  environmentName: string;
  reviewers: string[];
  projectKey: string;
  projectName: string;
  status: string;
  submitBy: string;
  title: string;
  toggleKey: string;
  toggleName: string;
  comment?: string;
  locked?: boolean;
  lockedTime?: string;
  modifiedTime?: string;
  canceled: boolean;
  cancelReason?: string;
}

export interface IApprovalList {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: IApproval[];
  number: number;
  empty: boolean;
}

export interface IApprovalParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  status: string[];
  type: string;
}

export interface IApprovalTotalParams {
  status: string
}

export interface IApprovalTotal {
  total: number
}

export interface IApprovalSetting {
  reviewers: string[];
  enable: boolean;
  environmentKey: string;
  environmentName: string;
  locked: boolean;
}

export interface ISettings {
  approvalSettings: IApprovalSetting[]
}