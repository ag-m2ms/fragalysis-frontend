import axios from 'axios';

export const axiosGet = async (...params) => {
  const response = await axios.get(...params);
  return response.data.results;
};

export const axiosPatch = async (...params) => {
  const response = await axios.patch(...params);
  return response;
};

export const axiosDelete = async (...params) => {
  const response = await axios.delete(...params);
  return response;
};
