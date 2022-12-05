import request from '../utils/request';
import qs from 'qs';
import API from '../constants/api';
import { IEnvironmentParams, IProject, IProjectParams, IExistParams, IArchivedParams } from 'interfaces/project';
import { ApplicationJson } from 'constants/api/contentType';
import { ISettings } from 'interfaces/approval';

export const getProjectList = async<T> () => {
  const url = API.getProjectListURI;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getEnvironmentList = async<T> (projectKey: string, params: IArchivedParams) => {
  const url = `${API.environmentURI.replace(':projectKey', projectKey)}?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getProjectInfo = async<T> (projectKey: string) => {
  const url = `${
    API.getProjectInfoURI
      .replace(':projectKey', projectKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const addProject = async (data: IProject) => {
  const url = API.addProjectURI;

  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const editProject = async(projectKey: string, data: IProjectParams) => {
  const url = `${
    API.editProjectURI
      .replace(':projectKey', projectKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const deleteProject = async(projectKey: string) => {
  const url = `${
    API.deleteProjectURI
      .replace(':projectKey', projectKey)
  }`;

  return request(url, {
    method: 'DELETE',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const addEnvironment = async(projectKey: string, data: IEnvironmentParams) => {
  const url = `${
    API.addEnvironmentURI
      .replace(':projectKey', projectKey)
  }`;

  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const editEnvironment = async(projectKey: string, environmentKey: string, data: IEnvironmentParams) => {
  const url = `${
    API.editEnvironmentURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const offlineEnvironment = async(projectKey: string, environmentKey: string) => {
  const url = `${
    API.offlineEnvironmentURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const restoreEnvironment = async(projectKey: string, environmentKey: string) => {
  const url = `${
    API.restoreEnvironmentURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getEnvironment = async<T> (projectKey: string, environmentKey: string) => {
  const url = `${
    API.editEnvironmentURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
  }`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const checkProjectExist = async<T> (params: IExistParams) => {
  const url = `${API.projectExistURI}?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getProjectApprovalSettings = async<T> (projectKey: string) => {
  const url = `${
    API.projectApprovalSetting
      .replace(':projectKey', projectKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const saveSettings = async<T> (projectKey: string, data: ISettings) => {
  const url = `${
    API.projectSetting
      .replace(':projectKey', projectKey)
  }`;
  
  return request<T>(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};