/**
 * Base API Service for communicating with Express.js Backend
 */

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  
  // Cara paling aman dan standar (TypeScript-friendly) untuk menggabungkan headers
  const headers = new Headers(options.headers);
  
  if (!isFormData) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  } else {
    // Pastikan tidak ada Content-Type agar browser bebas membuat boundary untuk FormData
    headers.delete('Content-Type');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errMsg = errorData.message || `API Error: ${response.status}`;
      if (errorData.errors && Array.isArray(errorData.errors)) {
          errMsg += "\n- " + errorData.errors.join("\n- ");
      }
      const err = new Error(errMsg) as any;
      if (errorData.code) err.code = errorData.code;
      if (errorData.nearest_date) err.nearest_date = errorData.nearest_date;
      if (errorData.nearest_schedule_id) err.nearest_schedule_id = errorData.nearest_schedule_id;
      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${url}:`, error);
    throw error;
  }
};
