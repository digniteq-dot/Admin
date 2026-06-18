import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://backend-pa8a.onrender.com/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('digniteq_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('digniteq_admin_refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                
                // Call refresh endpoint directly using axios to avoid infinite loops
                const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
                    refreshToken
                });
                
                const newAccessToken = res.data.token;
                localStorage.setItem('digniteq_admin_token', newAccessToken);
                
                // Update the failed request with the new token and retry it
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // Refresh failed (e.g., refresh token expired)
                localStorage.removeItem('digniteq_admin_token');
                localStorage.removeItem('digniteq_admin_refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
