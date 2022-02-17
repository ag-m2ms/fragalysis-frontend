import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/car/api/'
});

export const axiosGet = async (...params) => {
  const response = await axiosInstance.get(...params);
  return response.data.results;
};

export const axiosPatch = async (...params) => {
  const response = await axiosInstance.patch(...params);
  return response;
};

export const axiosDelete = async (...params) => {
  const response = await axiosInstance.delete(...params);
  return response;
};
