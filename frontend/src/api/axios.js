import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: `${BASE_URL}/api/`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
