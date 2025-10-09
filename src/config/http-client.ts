import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000
});

httpClient.interceptors.request.use((config) => {
  // Add token to headers if available

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., logging, redirection)
    return Promise.reject(error);
  }
);

// SWR v2 meneruskan AbortSignal lewat argumen kedua pada fetcher (key, { signal })
// Kita terima bentuk apapun dari key (string | array) dan ekstrak URL string pertama.
const fetcher = (key: string | readonly unknown[], opts?: { signal?: AbortSignal }) => {
  const url = typeof key === 'string' ? key : String(key[0]);
  return httpClient.get(url, { signal: opts?.signal }).then((res) => res.data);
};

export { httpClient, fetcher };
