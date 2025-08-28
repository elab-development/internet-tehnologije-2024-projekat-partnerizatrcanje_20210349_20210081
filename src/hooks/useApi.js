// hooks/useApi.js
import { useState, useEffect } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // Inicijalno je false
  const [error, setError] = useState(null);

  // NOVA LINIJA: Izvlačimo 'manual' opciju
  const { manual = false } = options;

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

      // Neki odgovori (npr. DELETE) možda nemaju telo
      if (response.status === 204) {
        setData(null);
        return null;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
      throw err; // Ponovo baci grešku da bi je uhvatio pozivalac
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // PROMENA: Proveravamo i '!manual' fleg
    if (url && !manual) {
      fetchData();
    }
  }, [url, manual]); // Dodajemo 'manual' u dependency array

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