// src/api/client.ts
import axios from 'axios';

// Base Axios instance with configuration
const API = axios.create({
  baseURL: 'https://localhost:3000/api', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
  