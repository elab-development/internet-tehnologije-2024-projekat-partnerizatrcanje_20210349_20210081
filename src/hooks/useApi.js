// hooks/useApi.js
import { useState, useEffect } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (customUrl = url, customOptions = options) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Dodaj Authorization header samo ako nije guest
      if (user.role !== 'guest' && token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(customUrl, {
        ...customOptions,
        headers: {
          ...defaultHeaders,
          ...customOptions.headers
        }
      });

      if (!response.ok) {
        if (response.status === 401 && user.role !== 'guest') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = () => fetchData();
  
  const post = async (postData) => {
    return fetchData(url, {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  };

  const put = async (putData) => {
    return fetchData(url, {
      method: 'PUT',
      body: JSON.stringify(putData)
    });
  };

  const del = async () => {
    return fetchData(url, {
      method: 'DELETE'
    });
  };

  return {
    data,
    loading,
    error,
    refetch,
    post,
    put,
    delete: del,
    fetchData
  };
};

export default useApi;