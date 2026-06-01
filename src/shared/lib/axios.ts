import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authSession } from './authSession';
import { tokenStorage } from './tokenStorage';
import { permissionStorage } from './permissionStorage';

function getAccessToken(): string | null {
  return tokenStorage.getToken() ?? authSession.getPendingAccessToken();
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Refresh queue ────────────────────────────────────────────────────────────
// While a refresh is in-flight, new 401s are queued and resolved/rejected
// together once the refresh settles.

type QueueItem = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let refreshQueue: QueueItem[] = [];

function processQueue(error: unknown, newToken: string | null): void {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(newToken!)
  );
  refreshQueue = [];
}

// ─── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Queue subsequent 401s while refresh is running
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const accessToken = tokenStorage.getToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!accessToken || !refreshToken) {
      tokenStorage.clear();
      permissionStorage.clear();
      window.location.href = '/sign-in';
      return Promise.reject(error);
    }

    try {
      // Use raw axios to avoid interceptor loop
      const { data } = await axios.post(
        `${BASE_URL}/panel/auth/refresh-token`,
        { token: accessToken, refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const newToken: string = data.data.token;
      const newRefreshToken: string = data.data.refreshToken;

      tokenStorage.setToken(newToken);
      tokenStorage.setRefreshToken(newRefreshToken);

      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      permissionStorage.clear();
      window.location.href = '/sign-in';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
