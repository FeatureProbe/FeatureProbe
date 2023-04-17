import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';

export const changeEventTrackerStatus = async <T>(projectKey: string, environmentKey: string, data: {
  enabled: boolean;
}) => {
  const url = `${
    API.eventTrackerStatus
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
  }`;

  return request<T>(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const getEventsStream = async <T>(projectKey: string, environmentKey: string, uuid: string) => {
  const url = `${
    API.eventStream
      .replace(':projectKey', projectKey)
      .replace(':environmentKey', environmentKey)
  }?uuid=${uuid}`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};
