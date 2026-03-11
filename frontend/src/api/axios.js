import axios from "axios";

export const BASE_URL = "https://lms-cloud-platform.onrender.com/api/";

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
