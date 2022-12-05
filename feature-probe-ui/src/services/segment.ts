import request from '../utils/request';
import API from '../constants/api';
import qs from 'qs';
import { ApplicationJson } from 'constants/api/contentType';
import { IExistParams, IVersionParams } from 'interfaces/project';
import { ISegmentInfo } from 'interfaces/segment';

interface ISegmentParams {
  pageIndex: number;
  pageSize: number;
}

export const getSegmentList = async<T> (projectKey: string, params: ISegmentParams) => {
  const url = `${
    API.segmentURI
      .replace(':projectKey', projectKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getSegmentDetail = async<T> (projectKey: string, segmentKey: string) => {
  const url = `${
    API.getSegmentURI
      .replace(':projectKey', projectKey)
      .replace(':segmentKey', segmentKey)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const addSegment = async (projectKey: string, data?: ISegmentInfo) => {
  const url = `${
    API.segmentURI
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

export const editSegment = async (projectKey: string, segmentKey: string, data?: ISegmentInfo) => {
  const url = `${
    API.getSegmentURI
      .replace(':projectKey', projectKey)
      .replace(':segmentKey', segmentKey)
  }`;
  
  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const confirmPublishSegment = async (projectKey: string, segmentKey: string, data?: ISegmentInfo & { comment: string }) => {
  const url = `${
    API.publishSegmentURI
      .replace(':projectKey', projectKey)
      .replace(':segmentKey', segmentKey)
  }`;
  
  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSegmentUsingToggles = async<T> (projectKey: string, segmentKey: string, params: any) => {
  const url = `${
    API.getSegmentToggleURI
      .replace(':projectKey', projectKey)
      .replace(':segmentKey', segmentKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const deleteSegment = async (projectKey: string, segmentKey: string) => {
  const url = `${
    API.getSegmentURI
      .replace(':projectKey', projectKey)
      .replace(':segmentKey', segmentKey)
  }`;
  
  return request(url, {
    method: 'DELETE',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const checkSegmentExist = async<T> (projectKey: string, params: IExistParams) => {
  const url = `${
    API.segmentExistURI
      .replace(':projectKey', projectKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getSegmentVersion = async<T> (projectKey: string, segmentKey: string, params: IVersionParams) => {
  const url = `${
    API.getSegmentVersionsURI
      .replace(':projectKey', projectKey)
      .replace(':segmentKey', segmentKey)
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};
