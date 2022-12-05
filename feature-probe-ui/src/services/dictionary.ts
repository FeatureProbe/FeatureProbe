import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';

export const getFromDictionary = async<T> (key: string) => {
  const url = `${
    API.dictionaryURI
    .replace(':key', key)
  }`;
  
  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson()
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveDictionary = async (key: string, data: any) => {
  const url = `${
    API.dictionaryURI
    .replace(':key', key)
  }`;
  
  return request(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson()
    },
    body: JSON.stringify(data),
  });
};