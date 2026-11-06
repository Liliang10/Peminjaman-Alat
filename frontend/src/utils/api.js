const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  console.log('🚀 [FRONTEND API] Sending request to:', `${BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log('📩 [FRONTEND API] Response status:', response.status);

    const textResponse = await response.text();
    let data;
    try {
      data = textResponse ? JSON.parse(textResponse) : {};
    } catch {
      data = { message: textResponse || `Error status ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(data.message || `Server Error (${response.status})`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ [FRONTEND API ERROR]:', error);
    if (error.name === 'AbortError') {
      throw new Error('Koneksi timeout (8s). Pastikan server backend di port 5001 berjalan.');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Gagal terhubung ke Backend! Pastikan server backend di port 5001 aktif.');
    }
    throw error;
  }
};