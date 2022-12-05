import { ISort, IPageable } from './toggle';

export interface IMemberParams {
  pageIndex: number;
  pageSize: number;
}

export interface IMember {
  account: string;
  role: string;
  createdBy: string;
  visitedTime: string;
  allowEdit: boolean;
}

export interface IMemberList {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: IMember[];
  number: number;
  empty: boolean;
}

export interface IUserInfo {
  account: string;
  role: string;
  token: string;
  organizeId: number;
}

export interface IUser {
  account: string;
  role: string;
  approvalCount?: number;
}

export interface IPassword {
  password: string;
}

export interface IAccounts {
  accounts: string[];
  password: string;
}

export interface IAccount {
  account: string;
}

export interface IPasswords {
  newPassword: string;
  oldPassword: string;
}

export interface IFormParams {
  accounts?: string[];
  password?: string;
  account?: string;
  role?: string;
}