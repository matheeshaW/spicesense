import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const fetchItems = async () => {
  return axios.get(`${API_BASE_URL}/items`);
};

export const fetchItemDetails = async (itemId) => {
  return axios.get(`${API_BASE_URL}/items/${itemId}`);
};

export const createOrder = async (orderData) => {
  return axios.post(`${API_BASE_URL}/orders/create`, orderData);
};
