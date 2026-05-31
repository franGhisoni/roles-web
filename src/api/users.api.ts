import { apiRequest } from '@/api/client';
import type {
  Assignment,
  AssignmentWithRole,
  ItemResponse,
  ListResponse,
  User,
} from '@/types/api';

export const usersApi = {
  list: () => apiRequest<ListResponse<User>>('/api/v1/users'),

  getById: (id: string) =>
    apiRequest<ItemResponse<User>>(`/api/v1/users/${id}`).then((r) => r.data),

  listRoles: (userId: string) =>
    apiRequest<ListResponse<AssignmentWithRole>>(
      `/api/v1/users/${userId}/roles`,
    ),

  assignRole: (userId: string, roleId: string) =>
    apiRequest<ItemResponse<Assignment>>(`/api/v1/users/${userId}/roles`, {
      method: 'POST',
      body: { roleId },
    }).then((r) => r.data),

  unassignRole: (userId: string, roleId: string) =>
    apiRequest<void>(`/api/v1/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    }),
};
