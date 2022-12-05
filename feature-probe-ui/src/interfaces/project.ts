export interface IRouterParams {
  projectKey: string;
  environmentKey: string;
  toggleKey: string;
  navigation: string;
  segmentKey: string;
}

export interface IEnvironment {
  name: string;
  key: string;
  clientSdkKey: string;
  serverSdkKey: string;
  archived?: boolean;
  enableApproval?: boolean;
}

export interface IEnvironmentParams {
  name?: string;
}

export interface IProject {
  name: string;
  key: string;
  description: string;
  environments: IEnvironment[];
}

export interface IProjectParams {
  name?: string;
  description?: string;
}

export interface ITag {
  name: string;
}

export interface ITagOption {
  key: string,
  text: string,
  value: string
}

export interface IToggleParams {
  pageIndex: number;
  pageSize: number;
  environmentKey?: string;
}

export interface IExistParams {
  value: string;
  type: string;
}

export interface IVersionParams {
  pageIndex: number;
  pageSize: number;
  version?: number;
}

export interface IArchivedParams {
  archived?: boolean;
}