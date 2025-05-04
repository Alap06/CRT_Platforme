// src/hooks/useApi.js
import { useState, useCallback } from 'react';

export function useApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      setData(response.data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    error,
    loading,
    callApi,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
}