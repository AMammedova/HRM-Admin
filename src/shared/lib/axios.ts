// src/shared/lib/axios.ts
import axios from 'axios';

/**
 * API Client - Axios instance
 * TODO: Configure when backend is ready
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// TODO: Add interceptors when auth is implemented

export default apiClient;