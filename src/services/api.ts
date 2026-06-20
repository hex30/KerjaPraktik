/**
 * Base API Service for communicating with Express.js Backend
 */

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errMsg = errorData.message || `API Error: ${response.status}`;
      if (errorData.errors && Array.isArray(errorData.errors)) {
          errMsg += "\n- " + errorData.errors.join("\n- ");
      }
      throw new Error(errMsg);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${url}:`, error);
    throw error;
  }
};
