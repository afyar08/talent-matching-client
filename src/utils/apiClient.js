import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is 401, redirect to login page
    if (error.response && error.response.status === 401) {
      // Clear any auth tokens stored in localStorage
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-id');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Continue with the error for other cases
    return Promise.reject(error);
  }
);

export default apiClient;