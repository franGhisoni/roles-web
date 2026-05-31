import { apiRequest } from '@/api/client';
import type {
  ItemResponse,
  PagedResponse,
  Role,
  RoleScope,
  RoleType,
} from '@/types/api';

export interface RolesListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: RoleType;
  scope?: RoleScope;
}

export interface CreateRolePayload {
  name: string;
  description?: string | null;
  type?: RoleType;
  scope?: RoleScope;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string | null;
  type?: RoleType;
  scope?: RoleScope;
}

export const rolesApi = {
  list: (params: RolesListParams = {}) =>
    apiRequest<PagedResponse<Role>>('/api/v1/roles', {
      query: { ...params },
    }),

  getById: (id: string) =>
    apiRequest<ItemResponse<Role>>(`/api/v1/roles/${id}`).then((r) => r.data),

  create: (payload: CreateRolePayload) =>
    apiRequest<ItemResponse<Role>>('/api/v1/roles', {
      method: 'POST',
      body: payload,
    }).then((r) => r.data),

  update: (id: string, payload: UpdateRolePayload) =>
    apiRequest<ItemResponse<Role>>(`/api/v1/roles/${id}`, {
      method: 'PATCH',
      body: payload,
    }).then((r) => r.data),

  remove: (id: string) =>
    apiRequest<void>(`/api/v1/roles/${id}`, { method: 'DELETE' }),
};
