import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });
          const { accessToken, refreshToken: newRefresh } = data.data;
          Cookies.set('accessToken', accessToken, { expires: 1 });
          Cookies.set('refreshToken', newRefresh, { expires: 7 });
          original.headers.Authorization = `Bearer ${accessToken}`;
          return api(original);
        } catch {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          if (typeof window !== 'undefined') window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
};

// ─── Exhibitions ─────────────────────────
export const exhibitionsApi = {
  list: (params?: any) => api.get('/exhibitions', { params }),
  get: (id: string) => api.get(`/exhibitions/${id}`),
  create: (data: any) => api.post('/exhibitions', data),
  update: (id: string, data: any) => api.patch(`/exhibitions/${id}`, data),
  delete: (id: string) => api.delete(`/exhibitions/${id}`),
  getPrograms: (id: string) => api.get(`/exhibitions/${id}/programs`),
  getParticipants: (id: string) => api.get(`/exhibitions/${id}/participants`),
  addProgram: (id: string, data: any) => api.post(`/exhibitions/${id}/programs`, data),
};

// ─── Booths ──────────────────────────────
export const boothsApi = {
  list: (exhibitionId: string) => api.get(`/exhibitions/${exhibitionId}/booths`),
  create: (exhibitionId: string, data: any) => api.post(`/exhibitions/${exhibitionId}/booths`, data),
  update: (exhibitionId: string, id: string, data: any) =>
    api.patch(`/exhibitions/${exhibitionId}/booths/${id}`, data),
};

// ─── Reservations ────────────────────────
export const reservationsApi = {
  create: (data: any) => api.post('/reservations', data),
  my: () => api.get('/reservations/my'),
  confirm: (id: string) => api.patch(`/reservations/${id}/confirm`),
  cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),
};

// ─── Companies ───────────────────────────
export const companiesApi = {
  list: (params?: any) => api.get('/companies', { params }),
  get: (id: string) => api.get(`/companies/${id}`),
  create: (data: any) => api.post('/companies', data),
  update: (id: string, data: any) => api.patch(`/companies/${id}`, data),
  getProducts: (id: string) => api.get(`/companies/${id}/products`),
};

// ─── Applications ────────────────────────
export const applicationsApi = {
  create: (data: any) => api.post('/applications', data),
  my: () => api.get('/applications/my'),
  update: (id: string, data: any) => api.patch(`/applications/${id}`, data),
  addDocument: (id: string, data: any) => api.post(`/applications/${id}/documents`, data),
};

// ─── News ────────────────────────────────
export const newsApi = {
  list: (params?: any) => api.get('/news', { params }),
  get: (id: string) => api.get(`/news/${id}`),
  create: (data: any) => api.post('/news', data),
};

// ─── Messages ────────────────────────────
export const messagesApi = {
  send: (data: any) => api.post('/messages', data),
  inbox: () => api.get('/messages/inbox'),
  conversation: (userId: string) => api.get(`/messages/conversation/${userId}`),
  markRead: (id: string) => api.patch(`/messages/${id}/read`),
};

// ─── Payments ────────────────────────────
export const paymentsApi = {
  my: () => api.get('/payments/my'),
};

// ─── Banners / Partners ──────────────────
export const bannersApi = {
  list: () => api.get('/banners'),
};
export const partnersApi = {
  list: () => api.get('/partners'),
};

// ─── Upload ──────────────────────────────
export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  document: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/document', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Admin ───────────────────────────────
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  reservations: (params?: any) => api.get('/admin/reservations', { params }),
  payments: (params?: any) => api.get('/admin/payments', { params }),
  applications: (params?: any) => api.get('/admin/applications', { params }),
  users: (params?: any) => api.get('/users', { params }),
};

export const unwrap = <T>(response: any): T => response.data.data as T;
