import axios from 'axios';

const TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;

/** Shared axios client for the TMDB v3 API (bearer-token auth). */
export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: 'application/json',
  },
});

tmdb.interceptors.request.use((config) => {
  if (TOKEN) {
    config.headers.set('Authorization', `Bearer ${TOKEN}`);
  }
  return config;
});

/** Generic GET helper that unwraps the axios data envelope. */
export async function tmdbGet<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const { data } = await tmdb.get<T>(url, { params });
  return data;
}
