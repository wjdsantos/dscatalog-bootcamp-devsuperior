import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { CLIENT_ID, CLIENT_SECRET, getSessionData, logout } from './auth';

type LoginData = {
    username: string;
    password: string;
}

const BASE_URL = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:8080';

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
        logout();
    }
    
    return Promise.reject(error);
  });

export const makeRequest = (params: AxiosRequestConfig) => {
    return axios({
        ...params,
        baseURL: BASE_URL
    });
}

export const makePrivateRequest = (params: AxiosRequestConfig) => {
    const sessionData = getSessionData();

    const headers = {
        'Authorization': `Bearer ${sessionData.access_token}`
    }

    return makeRequest({ ...params, headers });
}

export const makelogin = (loginData: LoginData) => {
    const token = `${CLIENT_ID}:${CLIENT_SECRET}`;

    const headers = {
        Authorization: `Basic ${window.btoa(token)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    // '/oauth/token'
    // username=maria@gmail.com&password=123456&grant_type=passaword

    //Usando a biblioteca qs
    const payload = qs.stringify({ ...loginData, grant_type: 'password' });

    return makeRequest({ url: '/oauth/token', data: payload, method: 'POST', headers })
}