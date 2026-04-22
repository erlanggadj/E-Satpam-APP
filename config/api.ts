// config/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from './env';

// Create a global Axios instance
export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier
    },
});

// Request Interceptor: Attach Auth Token + Debug log
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url} | Token: ${token ? 'YES' : 'NO'}`);
        } catch (error) {
            console.error('[API] Error fetching token from SecureStore', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 Unauthorized + Debug log
api.interceptors.response.use(
    (response) => {
        console.log(`[API] ✅ ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        if (error.response) {
            console.error(`[API] ❌ ${error.response.status} ${error.config?.url}`, error.response.data);
            // If the backend returns 401, token is likely expired or invalid
            if (error.response.status === 401) {
                console.warn('[API] 401 Unauthorized detected. Clearing token...');
                try {
                    await SecureStore.deleteItemAsync('access_token');
                } catch (clearError) {
                    console.error('[API] Failed to clear token on 401', clearError);
                }
            }
        } else if (error.request) {
            console.error(`[API] ❌ No response received for ${error.config?.url}. Is backend running?`, error.message);
        } else {
            console.error(`[API] ❌ Request setup error:`, error.message);
        }
        return Promise.reject(error);
    }
);
