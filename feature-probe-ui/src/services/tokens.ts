import request from '../utils/request';
import API from '../constants/api';
import { ApplicationJson } from 'constants/api/contentType';
import qs from 'qs';
import { CreateTokenParam, ListParam, TOKENTYPE } from 'interfaces/token';

export const createToken = async <T>(param: CreateTokenParam) => {
  const url = API.createTokenURI;

  return request<T>(url, {
    method: 'POST',
    headers: {
      ...ApplicationJson(),
    },
    body: JSON.stringify(param)
  });
};

export const getTokenList = async <T>(type: ListParam) => {
  const url = API.getTokenListURI + `?${qs.stringify(type)}`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson(),
    },
  });
};

export const deleteToken = async <T>(id: number) => {
  const url = API.deleteTokenURI.replace(':id', `${id}`);

  return request<T>(url, {
    method: 'DELETE',
    headers: {
      ...ApplicationJson(),
    },
  });
};

export const checkTokenNameExist = async<T>(name: string, type: TOKENTYPE) => {
  const url = API.checkExistURI  + `?${qs.stringify({name, type})}`;

  return request<T>(url, {
    method: 'GET',
    headers: {
      ...ApplicationJson(),
    },
  });
};
