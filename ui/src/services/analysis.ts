import request from '../utils/request';
import qs from 'qs';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';
import { IEvent } from 'interfaces/analysis';

export const getEventDetail = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.metric
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

export const getEventAnalysis = async<T> (projectKey: string, environmentKey: string, toggleKey: string, params: {
  start: string,
  end: string
}) => {
  const url = `${
    API.analysis
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

export const createEvent = async (projectKey: string, environmentKey: string, toggleKey: string, data: IEvent) => {
  const url = `${
    API.metric
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
      .replace(':toggleKey', toggleKey)
  }`;

  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

interface ITrackEvents {
  trackAccessEvents: boolean;
}

export const operateCollection = async (projectKey: string, environmentKey: string, toggleKey: string, data: ITrackEvents) => {
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

export const getMetricIterations = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.iterations
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

export const diagnoseResult = async<T> (projectKey: string, environmentKey: string, toggleKey: string, params: {
  start: string,
  end: string
}) => {
  const url = `${
    API.diagnose
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
