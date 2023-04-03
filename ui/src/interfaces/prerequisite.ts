import { ISort, IPageable } from './toggle';

export interface IPrerequisiteToggle {
  dependentValue: string;
  disabled: boolean;
  key: string;
  name: string;
}

export interface IPrerequisiteToggleList {
  totalElements: number;
  totalPages: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  content: IPrerequisiteToggle[];
  number: number;
  empty: boolean;
}
