import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/car/api/'
});

const createQueryEndpoint = (endpoint, queryParams) => {
  const query = queryParams
    ? `?${Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')}`
    : '';
  return endpoint + query;
};

export const axiosGet = async (queryKey, ...params) => {
  const endpoint = createQueryEndpoint(queryKey[0], queryKey[1]);
  const response = await axiosInstance.get(endpoint, ...params);
  return response.data.results;
};

export const axiosPost = async (...params) => {
  const response = await axiosInstance.post(...params);
  return response;
};

export const axiosPatch = async (...params) => {
  const response = await axiosInstance.patch(...params);
  return response;
};

export const axiosDelete = async (...params) => {
  const response = await axiosInstance.delete(...params);
  return response;
};
