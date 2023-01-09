import request from '../utils/request';
import API from '../constants/api';

export const getApplicationSettings = async<T> () => {
  const url = `${API.applicationSettings}`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
    },
  });
};

