import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  // xsrfHeaderName: 'X-CSRFToken',
  // xsrfCookieName: 'csrftoken'
});

api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {

        if (!document.cookie.includes('csrftoken')) {
            await api.get('/api/accounts/csrf/');
        }
        
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
            
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
    }
    return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export const getAdminFiles = (userId) => {
  return api.get(`/api/storage/admin/files/${userId}/`);
};

export const shareFileAsAdmin = (fileId) => {
  return api.post(`/api/storage/admin/share/${fileId}/`);
};

export default api;