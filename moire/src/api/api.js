import { API_BASE_URL } from '@/config';
import axios from 'axios';

export async function apiLoadProducts(params) {
  return axios.get(`${API_BASE_URL}/api/products`, { params });
}

export async function apiLoadProduct(id) {
  return axios.get(`${API_BASE_URL}/api/products/${id}`);
}

export async function apiCreateOrder(data) {
  return axios.post(`${API_BASE_URL}/api/orders`, data, {
    params: { userAccessKey: data.userAccessKey },
  });
}

export async function apiLoadOrderInfo(id, data) {
  return axios.get(`${API_BASE_URL}/api/orders/${id}`, {
    params: {
      userAccessKey: data.userAccessKey,
    },
  });
}

export async function apiLoadProductCategories() {
  return axios.get(`${API_BASE_URL}/api/productCategories`);
}

export async function apiLoadProductMaterials() {
  return axios.get(`${API_BASE_URL}/api/materials`);
}

export async function apiLoadProductSeasons() {
  return axios.get(`${API_BASE_URL}/api/seasons`);
}

export async function apiLoadProductColors() {
  return axios.get(`${API_BASE_URL}/api/colors`);
}

export async function apiLoadDeliveries() {
  return axios.get(`${API_BASE_URL}/api/deliveries`);
}

export async function apiLoadPayments(deliveryId) {
  return axios.get(`${API_BASE_URL}/api/payments`, {
    params: { deliveryTypeId: deliveryId },
  });
}

export async function apiAddProductToCart(data, params) {
  return axios.post(`${API_BASE_URL}/api/baskets/products`, data, { params });
}

export async function apiUpdateCartProductAmount(data, params) {
  return axios.put(`${API_BASE_URL}/api/baskets/products`, data, { params });
}

export async function apiDeleteCartProduct(data, params) {
  return axios.delete(`${API_BASE_URL}/api/baskets/products`, { data, params });
}

export async function apiLoadCart(params) {
  return axios.get(`${API_BASE_URL}/api/baskets`, { params });
}
