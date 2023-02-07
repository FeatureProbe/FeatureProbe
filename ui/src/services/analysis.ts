import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';
import { IEvent } from 'interfaces/analysis';

export const getEventDetail = async<T> (projectKey: string, environmentKey: string, toggleKey: string) => {
  const url = `${
    API.analysisMetric
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

export const createEvent = async (projectKey: string, environmentKey: string, toggleKey: string, data: IEvent) => {
  const url = `${
    API.analysisMetric
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
