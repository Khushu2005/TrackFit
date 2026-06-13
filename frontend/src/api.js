// frontend/src/api.js
import axios from 'axios';

// Development me localhost, production me tera live Render URL aayega
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Ye bodyguard ki tarah kaam karta hai. 
// Koi bhi request backend pe jaane se pehle ye usme automatically Token chipka dega.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trackfit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;