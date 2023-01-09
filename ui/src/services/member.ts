import qs from 'qs';
import request from '../utils/request';
import API from '../constants/api';
import { IMemberParams, IAccount, IPasswords, IFormParams} from 'interfaces/member';
import { ApplicationJson } from 'constants/api/contentType';

export const getMemberList = async<T> (params: IMemberParams) => {
  const url = `${
    API.membersURI
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const createMember = async (data: IFormParams) => {
  const url = API.membersURI;
  
  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const updateMember = async (data: IFormParams) => {
  const url = API.membersURI;
  
  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const deleteMember = async (data: IAccount) => {
  const url = API.membersURI;
  
  return request(url, {
    method: 'DELETE',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const modifyPassword = async (data: IPasswords) => {
  const url = API.modifyPasswordURI;
  
  return request(url, {
    method: 'PATCH',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};

export const getMember = async<T> (params: IAccount) => {
  const url = `${
    API.getMemberURI
  }?${qs.stringify(params)}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};