import { getAuthToken } from './auth';

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const V3_BASE = `${API_URL}/api/v3`;

async function getHeaders(requiresAuth = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export const endpoints = {
  // Auth endpoints
  register: `${V3_BASE}/auth/register`,
  login: `${V3_BASE}/auth/login`,
  updateUser: `${V3_BASE}/user/update-details`,
  deleteUser: `${V3_BASE}/user`,
  
  // Subscription endpoints
  subscribe: `${V3_BASE}/subscription/subscribe`,
  cancelSubscription: `${V3_BASE}/subscription/cancel`,
  subscriptionStatus: `${V3_BASE}/subscription/status`,
  checkoutSession: `${V3_BASE}/subscription/checkout`,
  
  // Protected API endpoints
  sentenceAnalysis: `${V3_BASE}/sentence/explanation`,
  sentenceCorrection: `${V3_BASE}/sentence/correction`,
  wordDefinition: `${V3_BASE}/word/definition`,
  wordSynonyms: `${V3_BASE}/word/synonyms`,
  wordHistory: `${V3_BASE}/word/history`,
};

export async function apiRequest(
  endpoint: string,
  options: RequestInit & { requiresAuth?: boolean } = {}
) {
  const { requiresAuth = false, ...fetchOptions } = options;
  
  const headers = await getHeaders(requiresAuth);
  
  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response;
}