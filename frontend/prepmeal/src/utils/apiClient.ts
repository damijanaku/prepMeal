import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5204';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const useApiClient = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const apiCall = async (url: string, options: RequestOptions = {}) => {
    const { requiresAuth = true, ...fetchOptions } = options;
    
    // Use full URL if it starts with http, otherwise prepend base URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      if (!accessToken) {
        throw new Error('No access token available');
      }
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Merge headers
    fetchOptions.headers = {
      ...headers,
      ...fetchOptions.headers,
    };

    try {
      let response = await fetch(fullUrl, fetchOptions);

      // Handle 401 for authenticated requests
      if (response.status === 401 && requiresAuth) {
        console.log('Access token expired, attempting refresh...');
        
        const refreshSuccess = await refreshAccessToken();
        
        if (refreshSuccess) {
          const newToken = localStorage.getItem('accessToken');
          if (newToken) {
            // Update the authorization header
            fetchOptions.headers = {
              ...fetchOptions.headers,
              'Authorization': `Bearer ${newToken}`,
            };
            
            // Retry the request
            response = await fetch(fullUrl, fetchOptions);
          } else {
            throw new Error('Failed to get new token');
          }
        } else {
          logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      // For non-OK responses, throw an error with the response
      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, get text
          try {
            const text = await response.text();
            if (text) {
              errorMessage = text;
            }
          } catch {
            // If we can't read the body, use default message
          }
        }
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = response;
        throw error;
      }

      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  return { apiCall };
};