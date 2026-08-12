import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001/api" : "/api"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jobboard_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jobboard_token");
      localStorage.removeItem("jobboard_user");
    }
    return Promise.reject(error);
  }
);

export default api;
