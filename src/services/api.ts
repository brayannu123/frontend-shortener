import axios from 'axios';

const shortenApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://e88mqe3ind.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

const statsApi = axios.create({
  baseURL:
    import.meta.env.VITE_STATS_API_URL ||
    'https://2g1p050mzf.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

const redirectBaseUrl =
  import.meta.env.VITE_REDIRECT_API_URL ||
  'https://unxbca7x7a.execute-api.us-east-1.amazonaws.com/dev';

export interface ShortenResponse {
  message: string;
  shortId: string;
  shortUrl: string;
  originalUrl: string;
}

export interface UrlStatsResponse {
  shortId: string;
  originalUrl: string;
  clicks: number;
  createdAt?: string;
  visits: string[];
  filteredClicks: number;
}

export const shortenUrl = async (url: string): Promise<ShortenResponse> => {
  const response = await shortenApi.post<ShortenResponse>('/shorten', { url });
  return response.data;
};

export const getUrlStats = async (shortId: string): Promise<UrlStatsResponse> => {
  const response = await statsApi.get<UrlStatsResponse>(`/stats/${encodeURIComponent(shortId)}`);
  return response.data;
};

export const getRedirectUrl = (shortId: string) => {
  return `${redirectBaseUrl.replace(/\/$/, '')}/${encodeURIComponent(shortId)}`;
};

export default shortenApi;
