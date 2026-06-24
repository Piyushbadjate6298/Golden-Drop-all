import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
