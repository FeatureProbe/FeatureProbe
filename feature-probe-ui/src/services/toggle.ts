import qs from 'qs';
import request from '../utils/request';
import API from '../constants/api';
import { IEditToggleParams, IToggle } from 'interfaces/toggle';
import { ITag, IToggleParams, IExistParams, IVersionParams } from 'interfaces/project';
import { ITargetingParams, IMetricParams } from 'interfaces/targeting';
import { ApplicationJson } from 'constants/api/contentType';

export const getToggleList = async<T> (projectKey: string, params: IToggleParams) => {
  const url = `${
    API.getToggleListURI
      .replace(':projectKey', projectKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getToggleInfo = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.getToggleInfoURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getTargeting = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.targetingURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const saveToggle = async (projectKey: string, environmentKey: string, toggleKey: string, data: ITargetingParams) => {
  const url = `${
    API.targetingURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const approveToggle = async (projectKey: string, environmentKey: string, toggleKey: string, data: ITargetingParams) => {
  const url = `${
    API.approvalTargetingURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data)
  });
};

export const createToggle = async (projectKey: string, data: IToggle) => {
  const url = `${
    API.createToggleURI
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

export const editToggle = async (projectKey: string, toggleKey: string, data: IEditToggleParams) => {
  const url = `${
    API.editToggleURI
      .replace(':projectKey', projectKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const offlineToggle = async (projectKey: string, toggleKey: string) => {
  const url = `${
    API.offlineToggleURI
      .replace(':projectKey', projectKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const restoreToggle = async (projectKey: string, toggleKey: string) => {
  const url = `${
    API.restoreToggleURI
      .replace(':projectKey', projectKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getTags = async<T> (projectKey: string) => {
  const url = `${
    API.tagsURI
      .replace(':projectKey', projectKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const addTag = async (projectKey: string, data: ITag) => {
  const url = `${
    API.tagsURI
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

export const getMetrics = async<T> (projectKey: string, environmentKey: string, toggleKey: string, params: IMetricParams) => {
  const url = `${
    API.merticsURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }?${qs.stringify(params)}`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const checkToggleExist = async<T> (projectKey: string, params: IExistParams) => {
  const url = `${
    API.toggleExistURI
      .replace(':projectKey', projectKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const checkEnvironmentExist = async<T> (projectKey: string, params: IExistParams) => {
  const url = `${
    API.environmentExistURI
      .replace(':projectKey', projectKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getTargetingVersion = async<T> (projectKey: string, environmentKey: string, toggleKey: string, params: IVersionParams) => {
  const url = `${
    API.targetingVersionsURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getTargetingVersionsByVersion = async<T> (projectKey: string, environmentKey: string, toggleKey: string, version: number) => {
  const url = `${
    API.targetingVersionsByVersionURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
      .replace(':version', '' + version)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getToggleAccess = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.toggleAccessURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getTargetingDiff = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.targetingDiffURI
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};
