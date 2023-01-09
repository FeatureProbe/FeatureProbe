import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';

interface ILoginParams {
  account: string;
  password: string;
  source?: string;
}

export const getUserInfo = async<T> () => {
  const url = API.userInfoURI;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

export const login = async<T>(data: ILoginParams) => {
  const url = `${API.loginURI}`;
  
  return request<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
    },
    body: JSON.stringify(data),
  });
};

export const demoLogin = async<T>(data: ILoginParams) => {
  const url = `${API.demoLoginURI}`;
  
  return request<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
    },
    body: JSON.stringify(data),
  });
};

export const logout = async<T> () => {
  const url = API.logoutURI;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};
