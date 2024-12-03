// src/api/client.ts
import axios from 'axios';

// Base Axios instance with configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL, // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
  