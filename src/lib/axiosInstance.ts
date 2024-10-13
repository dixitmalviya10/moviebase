import axios from 'axios';

// const API_KEY = import.meta.env.VITE_API_KEY; // Adjust if using Vite
const TOKEN = import.meta.env.VITE_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

// Request Interceptor to add the API key to each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach the API key to params
    if (config.headers) {
      // Use set to update headers
      config.headers.set('Authorization', `Bearer ${TOKEN}`);
    }
    return config;

    // config.params = {
    //   ...config.params,
    //   api_key: API_KEY,
    // };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('call the refresh token api here');
      // Handle 401 error, e.g., redirect to login or refresh token
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
