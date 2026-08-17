import { useAuth } from '../context/AuthContext';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean; // do we need token
}

export const useApiClient = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth(); // gets authentication data from context

  const apiCall = async (url: string, options: RequestOptions = {}) => {
    const { requiresAuth = true, ...fetchOptions } = options;

    if (requiresAuth) {
      if (!accessToken) {
        throw new Error('No access token available');
      }

    // Add the Authorization header to the headers of the request if requiresAuth is true
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
    }

    try {
      let response = await fetch(url, fetchOptions);

      if (response.status === 401 && requiresAuth) {
        console.log('Access token expired, attempting refresh...');
        
        const refreshSuccess = await refreshAccessToken();
        
        if (refreshSuccess) {
          const newToken = localStorage.getItem('accessToken');
          if (newToken) {
            fetchOptions.headers = {
              ...fetchOptions.headers,
              'Authorization': `Bearer ${newToken}`,
            };
            
            response = await fetch(url, fetchOptions);
          } else {
            throw new Error('Failed to get new token');
          }
        } else {
          logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  return { apiCall };
};

export default useApiClient;