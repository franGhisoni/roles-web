import { apiRequest } from '@/api/client';
import type { StatusSnapshot } from '@/types/api';

export const healthApi = {
  status: () => apiRequest<StatusSnapshot>('/api/v1/status'),
  liveness: () => apiRequest<{ status: string }>('/api/v1/healthz'),
};
