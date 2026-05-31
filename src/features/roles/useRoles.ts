import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi, type CreateRolePayload, type RolesListParams, type UpdateRolePayload } from '@/api/roles.api';

export const rolesKeys = {
  all: ['roles'] as const,
  list: (params: RolesListParams) => [...rolesKeys.all, 'list', params] as const,
  detail: (id: string) => [...rolesKeys.all, 'detail', id] as const,
};

export function useRoles(params: RolesListParams) {
  return useQuery({
    queryKey: rolesKeys.list(params),
    queryFn: () => rolesApi.list(params),
    placeholderData: (previous) => previous,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rolesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateRolePayload }) =>
      rolesApi.update(vars.id, vars.payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rolesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }),
  });
}
