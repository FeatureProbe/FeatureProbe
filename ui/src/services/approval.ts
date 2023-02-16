import qs from 'qs';
import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';
import { IApprovalParams, IApprovalTotalParams } from 'interfaces/approval';

export const getApprovalList = async<T> (params: IApprovalParams) => {
  const url = `${API.approvalRecords}?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const getApprovalTotalByStatus = async<T> (params: IApprovalTotalParams) => {
  const url = `${API.approvalTotal}?${qs.stringify(params)}`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export interface IApprovalStatus {
  status: string;
  comment: string;
  trackAccessEvents?: boolean;
}

export interface ITrackEvents {
  trackAccessEvents?: boolean;
}

export const updateApprovalStatus = async<T> (projectKey: string, environmentKey: string, toggleKey: string, data: IApprovalStatus) => {
  const url = `${API.approvalStatus
    .replace(':projectKey', projectKey)
    .replace(':environmentKey', environmentKey)
    .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const publishTargetingDraft = async<T> (projectKey: string, environmentKey: string, toggleKey: string, data?: ITrackEvents) => {
  const url = `${API.publishTargetingSketch
    .replace(':projectKey', projectKey)
    .replace(':environmentKey', environmentKey)
    .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

interface IComment {
  comment?: string;
}

export const cancelTargetingDraft = async<T> (projectKey: string, environmentKey: string, toggleKey: string, data: IComment) => {
  const url = `${API.cancelTargetingSketch
    .replace(':projectKey', projectKey)
    .replace(':environmentKey', environmentKey)
    .replace(':toggleKey', toggleKey)
  }`;
  
  return request<T>(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};
